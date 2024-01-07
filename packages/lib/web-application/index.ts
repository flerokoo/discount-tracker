import "reflect-metadata";
import http from "node:http";
import https from "node:https";

import {
  DependencyContainer,
  InjectionToken,
  container as globalContainer,
  inject,
  injectable,
  singleton,
} from "tsyringe";
import { readFileSync } from "node:fs";
type Ctor<T> = { new (...args: any[]): T };

class Binding<T> {
  constructor(
    public name: InjectionToken,
    public value: Ctor<T>,
  ) {}
  as(token: InjectionToken) {
    this.name = token;
    return this;
  }
}

export const bind = <T>(type: Ctor<T>) => new Binding(type.name, type);

type WebApplicationHttpParams = {
  enabled: boolean,
  port: number;
};

type WebApplicationHttpsParams = WebApplicationHttpParams & {
  certPath: string;
  keyPath: string;
};

type WebApplicationParams<TRepositories, TServices, TControllers, TValues> = {
  repositories: (Binding<TRepositories> | Ctor<TRepositories>)[];
  services: (Binding<TServices> | Ctor<TServices>)[];
  controllers: (Binding<TControllers> | Ctor<TControllers>)[];
  values?: TValues;
  http?: WebApplicationHttpParams;
  https?: WebApplicationHttpsParams;
};

export class WebApplication<TRepositories, TServices, TControllers, TValues extends object> {
  public readonly container: DependencyContainer;
  private params: WebApplicationParams<TRepositories, TServices, TControllers, TValues>;
  private httpServer!: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  private httpsServer!: https.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

  constructor(params: WebApplicationParams<TRepositories, TServices, TControllers, TValues>) {
    this.params = params;
    const { services, repositories, values, controllers } = params;
    this.container = globalContainer.createChildContainer();
    this.registerServices(services);
    this.registerServices(repositories);
    this.registerServices(controllers);
    if (values) this.registerValues(values);
  }

  private registerValues<TValues extends object>(values: TValues) {
    for (let key of Object.keys(values)) {
      this.container.register(key, { useValue: values[key as keyof TValues] });
    }
  }

  private registerServices<T>(services: (Binding<T> | Ctor<T>)[]) {
    for (let service of services) {
      const token = service instanceof Binding ? service.name : service;
      const type = service instanceof Binding ? service.value : service;
      console.log(token, type);
      this.container.register(token, { useClass: type });
    }
  }

  async listen() {
    const params = this.params;
    const promises = [];
    const start = (server: any, port: number) =>
      new Promise((resolve) => {
        server.listen(port, resolve);
      });

    if (params.http?.enabled) {
      const { port } = params.http;
      const server = (this.httpServer = http.createServer());
      promises.push(start(server, port));
    }

    if (params.https?.enabled) {
      const { port, certPath, keyPath } = params.https;
      const cert = readFileSync(certPath, "utf-8");
      const key = readFileSync(keyPath, "utf-8");
      const server = (this.httpsServer = https.createServer({ key, cert }));
      promises.push(start(server, port));
    }

    await Promise.all(promises);
  }
}

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

@singleton()
class Controller {
  constructor(a: Sample, b: ServiceB) {
    console.log("controller: ", a, b);
  }
}

const app = new WebApplication({
  repositories: [Repo],
  services: [bind(ServiceA).as(Sample), ServiceB],
  controllers: [Controller],
  http: {
    enabled: true,
    port: 3000
  }
});

app.container.resolve(Controller);

app.listen().then(() => console.log("listenening"));
