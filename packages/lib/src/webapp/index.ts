import "reflect-metadata";
import http from "node:http";
import https from "node:https";
import {
  DependencyContainer,
  InjectionToken,
  Lifecycle,
  container as globalContainer,
  inject,
  singleton,
} from "tsyringe";
import { readFileSync } from "node:fs";
import gracefulShutdownHandler from "../utils/graceful-shutdown";
import { WebApplicationParams, Ctor } from "./types";
import { Binding, bind } from "./Binding";
import express from "express";
import type { Request, Response } from "express";
import { configureExpress } from "./configure-express-app";
import { createRouterFromMetadata } from "./routes/create-router-from-metadata";
import { Prefix, Get } from "../utils/Route.decorator";
import { IUser } from "@repo/domain/src/entities/IUser";

export class WebApplication {
  private container: DependencyContainer;
  private params: WebApplicationParams;
  private httpServer!: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  private httpsServer!: https.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  private expressApp!: express.Application | undefined;
  private listening = false;

  constructor(params: WebApplicationParams) {
    this.params = params;
    const { services, repositories, values, controllers } = params;
    this.container = globalContainer.createChildContainer();
    this.container.registerInstance(WebApplication, this);
    if (services) this.registerServices(services);
    if (repositories) this.registerServices(repositories);
    if (controllers) this.registerServices(controllers);
    if (values) this.registerValues(values);
  }

  private registerValues(values: Record<string, any>) {
    for (let key of Object.keys(values)) {
      this.container.register(key, { useValue: values[key] });
    }
  }

  private registerServices<T>(services: (Binding<T> | Ctor<T>)[]) {
    for (let service of services) {
      const token = service instanceof Binding ? service.token : service;
      const type = service instanceof Binding ? service.value : service;
      this.container.registerSingleton(token, type);
    }
  }

  public async listen() {
    if (this.listening) return;
    this.createExpressApp();
    const { params, expressApp } = this;
    const promises : Promise<unknown>[] = [];

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

    const promises: Promise<unknown>[] = [];
    if (this.httpServer) promises.push(close(this.httpServer));
    if (this.httpsServer) promises.push(close(this.httpsServer));
  }

  private createExpressApp() {
    const app = express();
    configureExpress(app, this.params.auth?.(this));
    const controllers = this.params.controllers ?? [];
    for (let contrId of controllers) {
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
