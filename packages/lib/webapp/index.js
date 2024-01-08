"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebApplication = void 0;
require("reflect-metadata");
const node_http_1 = __importDefault(require("node:http"));
const node_https_1 = __importDefault(require("node:https"));
const tsyringe_1 = require("tsyringe");
const node_fs_1 = require("node:fs");
const graceful_shutdown_1 = __importDefault(require("../utils/graceful-shutdown"));
const Binding_1 = require("./Binding");
const express_1 = __importDefault(require("express"));
const configure_express_app_1 = require("./configure-express-app");
const Route_decorator_1 = require("../utils/Route.decorator");
const create_router_from_metadata_1 = require("./routes/create-router-from-metadata");
class WebApplication {
    container;
    params;
    httpServer;
    httpsServer;
    expressApp;
    listening = false;
    constructor(params) {
        this.params = params;
        const { services, repositories, values, controllers } = params;
        this.container = tsyringe_1.container.createChildContainer();
        this.registerServices(services);
        this.registerServices(repositories);
        this.registerServices(controllers);
        this.createExpressApp();
        if (values)
            this.registerValues(values);
    }
    registerValues(values) {
        for (let key of Object.keys(values)) {
            this.container.register(key, { useValue: values[key] });
        }
    }
    registerServices(services) {
        for (let service of services) {
            const token = service instanceof Binding_1.Binding ? service.token : service;
            const type = service instanceof Binding_1.Binding ? service.value : service;
            console.log(token, type);
            this.container.register(token, { useClass: type });
        }
    }
    async listen() {
        if (this.listening)
            return;
        const { params, expressApp } = this;
        const promises = [];
        const start = (server, port, hostname) => new Promise((resolve) => {
            server.listen(port, hostname, resolve);
        });
        const shutdownGracefully = (server) => graceful_shutdown_1.default.addCallback(() => {
            return new Promise((resolve) => {
                server.close(resolve);
            });
        });
        if (params.http?.enabled) {
            const { port, hostname } = params.http;
            const server = (this.httpServer = node_http_1.default.createServer(expressApp));
            shutdownGracefully(server);
            promises.push(start(server, port, hostname));
        }
        if (params.https?.enabled) {
            const { port, hostname, certPath, keyPath } = params.https;
            const cert = (0, node_fs_1.readFileSync)(certPath, "utf-8");
            const key = (0, node_fs_1.readFileSync)(keyPath, "utf-8");
            const server = (this.httpsServer = node_https_1.default.createServer({ key, cert }, expressApp));
            shutdownGracefully(server);
            promises.push(start(server, port, hostname));
        }
        this.listening = true;
        await Promise.all(promises);
    }
    async close() {
        const close = (server) => new Promise((resolve) => {
            server.close(resolve);
        });
        const promises = [];
        if (this.httpServer)
            promises.push(close(this.httpServer));
        if (this.httpsServer)
            promises.push(close(this.httpsServer));
    }
    createExpressApp() {
        const app = (0, express_1.default)();
        (0, configure_express_app_1.configureExpress)(app, this.params.auth?.(this));
        for (let contrId of this.params.controllers) {
            const token = contrId instanceof Binding_1.Binding ? contrId.token : contrId;
            const controller = this.container.resolve(token);
            const router = (0, create_router_from_metadata_1.createRouterFromMetadata)(controller);
            app.use(router);
        }
        this.expressApp = app;
    }
}
exports.WebApplication = WebApplication;
console.log("VOT");
class Sample {
}
let Repo = class Repo {
    constructor() {
        console.log("repo");
    }
};
Repo = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [])
], Repo);
let ServiceA = class ServiceA extends Sample {
    constructor() {
        super();
        console.log("from A");
    }
};
ServiceA = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [])
], ServiceA);
let ServiceB = class ServiceB {
    a;
    constructor(a) {
        this.a = a;
        console.log("from B: " + a);
    }
};
ServiceB = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [Sample])
], ServiceB);
let Controller = class Controller {
    constructor(a, b, c) {
        console.log("controller: ", a, b, c);
    }
    helloWorld(req, res) {
        res.end("Hello world!");
    }
};
__decorate([
    (0, Route_decorator_1.Get)("/world"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Controller.prototype, "helloWorld", null);
Controller = __decorate([
    (0, tsyringe_1.singleton)(),
    (0, Route_decorator_1.Prefix)("/hello"),
    __param(2, (0, tsyringe_1.inject)("concurrency")),
    __metadata("design:paramtypes", [Sample, ServiceB, Number])
], Controller);
const app = new WebApplication({
    repositories: [Repo],
    services: [(0, Binding_1.bind)(ServiceA).as(Sample), ServiceB],
    controllers: [Controller],
    values: {
        concurrency: 5,
    },
    http: {
        enabled: true,
        port: 3000,
    },
});
app.container.resolve(Controller);
app.listen().then(() => console.log("listenening"));
