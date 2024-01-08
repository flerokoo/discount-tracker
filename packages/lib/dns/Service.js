"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const node_events_1 = __importDefault(require("node:events"));
const node_http_1 = __importDefault(require("node:http"));
const node_http_2 = __importDefault(require("node:http"));
class Service extends node_events_1.default {
    address;
    _isAlive = true;
    _healtCheckScheduler;
    _healthCheckTimeoutInstance;
    constructor(address) {
        super();
        this.address = address;
    }
    getBaseUrl(protocol, port) {
        const { address } = this;
        return `${protocol}://${address}:${port}`;
    }
    get isAlive() {
        return this._isAlive;
    }
    async ping(url, port, protocol = "http") {
        return new Promise((resolve, reject) => {
            (protocol === "http" ? node_http_1.default : node_http_2.default)
                .get(this.getBaseUrl(protocol, port) + url, (res) => resolve(true))
                .on("error", (err) => resolve(false));
        }).then((isAlive) => {
            this._isAlive = isAlive;
            if (!isAlive)
                this.emit("dead");
            else
                this._healtCheckScheduler?.();
            return isAlive;
        });
    }
    enableHealthCheck(port, url = "/health", interval = 5, protocol = "http") {
        this._healtCheckScheduler = () => {
            const cb = () => this.ping(url, port, protocol);
            this._healthCheckTimeoutInstance = setTimeout(cb, interval * 1000);
        };
        this._healtCheckScheduler();
    }
    disableHealthCheck() {
        this._healtCheckScheduler = null;
        clearTimeout(this._healthCheckTimeoutInstance);
    }
}
exports.Service = Service;
