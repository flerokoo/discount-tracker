"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRequestContext = void 0;
const request_context_js_1 = require("../request-context.js");
function setRequestContext(req, res, next) {
    (0, request_context_js_1.runRequestWithinContext)({}, next);
}
exports.setRequestContext = setRequestContext;
