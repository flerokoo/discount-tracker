"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const handle_error_js_1 = require("../handle-error.js");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(err, req, res, next) {
    (0, handle_error_js_1.handleError)(err, res);
}
exports.errorHandler = errorHandler;
