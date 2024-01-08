"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getControllerMetadata = exports.Put = exports.Delete = exports.Get = exports.Post = exports.Prefix = void 0;
const errors_js_1 = require("./errors.js");
const ROUTE_PREFIX_META_KEY = '__routeprefix__';
const ROUTE_META_KEY = '__route__';
function Prefix(prefix) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target) {
        Reflect.defineMetadata(ROUTE_PREFIX_META_KEY, prefix, target.prototype);
    };
}
exports.Prefix = Prefix;
function Route(method, path, params) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata(ROUTE_META_KEY, { method, path, propertyKey, params }, target, propertyKey);
        const original = descriptor.value;
        descriptor.value = async function (req, res, next) {
            const tasks = [
                ['body', params?.bodySchema],
                // ['params', params?.paramsSchema],
                // ['query', params?.querySchema]
            ];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const issues = {};
            let errorFound = false;
            for (const [name, schema] of tasks) {
                const obj = req[name];
                if (!obj || !schema)
                    continue;
                const result = await schema.safeParseAsync(obj);
                if (!result.success) {
                    issues[name] = result.error.issues;
                    errorFound = true;
                }
            }
            if (errorFound) {
                throw new errors_js_1.ValidationError('Validation Error', issues);
            }
            return original.call(this, req, res, next);
        };
    };
}
function Post(path, params) {
    return Route('post', path, params);
}
exports.Post = Post;
function Get(path, params) {
    return Route('get', path, params);
}
exports.Get = Get;
function Delete(path, params) {
    return Route('delete', path, params);
}
exports.Delete = Delete;
function Put(path, params) {
    return Route('put', path, params);
}
exports.Put = Put;
function getControllerMetadata(proto) {
    const methodsWithMetadata = [];
    for (const propertyName of Object.getOwnPropertyNames(proto)) {
        if (propertyName === 'constructor') {
            continue;
        }
        const meta = Reflect.getMetadata(ROUTE_META_KEY, proto, propertyName);
        if (meta) {
            methodsWithMetadata.push(meta);
        }
    }
    const prefix = Reflect.getMetadata(ROUTE_PREFIX_META_KEY, proto) ?? "/";
    return {
        routes: methodsWithMetadata,
        prefix
    };
}
exports.getControllerMetadata = getControllerMetadata;
