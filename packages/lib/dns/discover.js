"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.discover = void 0;
const promises_1 = __importDefault(require("node:dns/promises"));
const Service_1 = require("./Service");
const node_events_1 = __importDefault(require("node:events"));
const lookup = async (hostname) => {
    const result = await promises_1.default.lookup(hostname, { all: true });
    return result.map((_) => _.address);
};
const discover = async (hostname, port) => {
    const emitter = new node_events_1.default();
    let rrIndex = 0;
    let services = [];
    const update = async () => {
        services.forEach((_) => _.removeAllListeners()); // dereference
        const ips = await lookup(hostname);
        services = ips.map((_) => new Service_1.Service(_));
        for (const service of services) {
            emitter.emit("created", service);
            service.on("dead", () => {
                emitter.emit("dead", service);
                const ii = services.indexOf(service);
                services.splice(ii, 1);
                if (services.length === 0)
                    update();
            });
        }
        rrIndex = 0;
    };
    try {
        await update();
    }
    catch (err) {
        throw new Error(`Error when discovering ${hostname} services`);
    }
    return {
        getNextAlive() {
            if (services.length === 0)
                throw new Error(`No service address: ${hostname}`);
            rrIndex = (rrIndex + 1) % services.length;
            return services[rrIndex];
        },
        getAll() {
            return services;
        },
        get aliveCount() {
            return services.length;
        },
        on(evt, listener) {
            return emitter.on(evt, listener);
        },
        off(evt, listener) {
            return emitter.off(evt, listener);
        },
    };
};
exports.discover = discover;
