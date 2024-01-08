import "reflect-metadata";
import http from "node:http";
import https from "node:https";
import { DependencyContainer, InjectionToken, container as globalContainer, inject, singleton } from "tsyringe";
import { readFileSync } from "node:fs";
import gracefulShutdownHandler from "../utils/graceful-shutdown";
import { WebApplicationParams, Ctor } from "./types";
import { Binding, bind } from "./Binding";
import express from "express";
import type { Request, Response } from "express";
import { configureExpress } from "./configure-express-app";
import { createRouterFromMetadata } from "./routes/create-router-from-metadata";
import { Prefix, Get } from "../utils/Route.decorator";
import { IUser } from "@repo/domain/entities/IUser";

export class WebApplication<TRepository, TService, TController> {
  private container: DependencyContainer;
  private params: WebApplicationParams<TRepository, TService, TController>;
  private httpServer!: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  private httpsServer!: https.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  private expressApp!: express.Application;
  private listening = false;

  constructor(params: WebApplicationParams<TRepository, TService, TController>) {
    this.params = params;
    const { services, repositories, values, controllers } = params;
    this.container = globalContainer.createChildContainer();
    this.registerServices(services);
    this.registerServices(repositories);
    this.registerServices(controllers);
    if (values) this.registerValues(values);
    this.createExpressApp();
  }

  private registerValues(values: Record<string, any>) {
    for (let key of Object.keys(values)) {
      console.log(key, values[key])
      this.container.register(key, { useValue: values[key] });
    }
  }

  private registerServices<T>(services: (Binding<T> | Ctor<T>)[]) {
    for (let service of services) {
      const token = service instanceof Binding ? service.token : service;
      const type = service instanceof Binding ? service.value : service;
      this.container.register(token, { useClass: type });
    }
  }

  public async listen() {
    if (this.listening) return;
    const { params, expressApp } = this;
    const promises = [];

    const start = (server: any, port: number, hostname?: string) =>
      new Promise((resolve) => {
        server.listen(port, hostname, resolve);
      });

    const shutdownGracefully = (server: http.Server | https.Server) =>
      gracefulShutdownHandler.addCallback(() => {
        return new Promise((resolve) => {
          server.close(resolve as any);
        });
      });

    if (params.http?.enabled) {
      const { port, hostname } = params.http;
      const server = (this.httpServer = http.createServer(expressApp));
      shutdownGracefully(server);
      promises.push(start(server, port, hostname));
    }

    if (params.https?.enabled) {
      const { port, hostname, certPath, keyPath } = params.https;
      const cert = readFileSync(certPath, "utf-8");
      const key = readFileSync(keyPath, "utf-8");
      const server = (this.httpsServer = https.createServer({ key, cert }, expressApp));
      shutdownGracefully(server);
      promises.push(start(server, port, hostname));
    }

    this.listening = true;

    await Promise.all(promises);
  }

  public async close() {
    const close = (server: any) => 
      new Promise((resolve) => {
        server.close(resolve);
      });

    const promises = [];
    if (this.httpServer) promises.push(close(this.httpServer));
    if (this.httpsServer) promises.push(close(this.httpsServer));
  }

  private createExpressApp() {  
    const app = express();
    configureExpress(app, this.params.auth?.(this));
 
    for (let contrId of this.params.controllers) {
      const token = contrId instanceof Binding ? contrId.token : contrId;
      const controller = this.container.resolve(token);
      const router = createRouterFromMetadata(controller);
      app.use(router);
    }

    this.expressApp = app;
  }

  public getDependency<T>(token: InjectionToken<T>) {
    return this.container.resolve<T>(token) as T;
  }
}
console.log("VOT");
interface ISample {}

class Sample {}

@singleton()
class Repo {
  constructor() {
    console.log("repo");
  }
}

@singleton()
class ServiceA extends Sample {
  constructor() {
    super();
    console.log("from A");
  }
}

@singleton()
class ServiceB {
  constructor(private a: Sample) {
    console.log("from B: " + a);
  }
}

class UnusedService {

}

@singleton()
@Prefix("/hello")
class Controller1 {
  constructor(a: Sample, b: ServiceB, @inject("concurrency") c: number) {
    console.log("controller: ", a, b, c);
  }

  @Get("/world", {checkAuth: true})
  private helloWorld(req: Request, res: Response) {
    res.end("Hello world!");
  }
}

const app = new WebApplication({
  repositories: [Repo],
  services: [bind(ServiceA).as(Sample), ServiceB],
  controllers: [Controller1],
  values: {
    concurrency: 5,
  },
  http: {
    enabled: true,
    port: 3000,
  },
  auth: app => (req, res) => {
    return  {id: 1} as IUser
  }
});

app.listen().then(() => console.log("listenening"));
