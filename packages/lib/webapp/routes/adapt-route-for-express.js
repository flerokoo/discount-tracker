"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptRouteForExpress = void 0;
const handle_error_js_1 = require("../handle-error.js");
// wrapper for async rejections handling within express app
function adaptRouteForExpress(handler) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (err) {
            (0, handle_error_js_1.handleError)(err instanceof Error ? err : new Error(JSON.stringify(err)), res);
        }
    };
}
exports.adaptRouteForExpress = adaptRouteForExpress;
