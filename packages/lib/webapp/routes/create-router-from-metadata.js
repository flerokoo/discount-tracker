"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouterFromMetadata = void 0;
const Route_decorator_js_1 = require("../../utils/Route.decorator.js");
const express_1 = __importDefault(require("express"));
const adapt_route_for_express_js_1 = require("./adapt-route-for-express.js");
const auth_js_1 = require("../middlewares/auth.js");
const node_path_1 = __importDefault(require("node:path"));
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
function createRouterFromMetadata(obj) {
    const { prefix, routes } = (0, Route_decorator_js_1.getControllerMetadata)(obj.constructor.prototype);
    const router = express_1.default.Router();
    for (const { method, path, propertyKey, params } of routes) {
        const fn = obj[propertyKey];
        if (typeof fn !== 'function') {
            throw new Error(`${obj.constructor.name}.${propertyKey} is not a valid controller method`);
        }
        const callbacks = [(0, adapt_route_for_express_js_1.adaptRouteForExpress)(fn.bind(obj))];
        if (params?.checkAuth) {
            callbacks.unshift(auth_js_1.checkAuth);
        }
        const pathWithPrefix = node_path_1.default.join(prefix, path);
        router[method](pathWithPrefix, ...callbacks);
    }
    return router;
}
exports.createRouterFromMetadata = createRouterFromMetadata;
