"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureExpress = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const error_handler_js_1 = require("./middlewares/error-handler.js");
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const set_request_context_js_1 = require("./middlewares/set-request-context.js");
const graceful_shutdown_js_1 = __importDefault(require("../utils/graceful-shutdown.js"));
const graceful_shutdown_js_2 = require("./middlewares/graceful-shutdown.js");
const log_js_1 = require("./middlewares/log.js");
function configureExpress(app, authenticator) {
    app.use((0, helmet_1.default)());
    app.use((0, graceful_shutdown_js_2.createGracefulShutdownMiddleware)(graceful_shutdown_js_1.default));
    app.use((0, compression_1.default)());
    app.use(body_parser_1.default.json({ limit: "5mb" }));
    app.use(express_1.default.urlencoded({ limit: "5mb", extended: true, parameterLimit: 50000 }));
    app.use((0, cookie_parser_1.default)());
    app.use(log_js_1.logMiddleware);
    app.use(set_request_context_js_1.setRequestContext);
    if (authenticator)
        app.use(authenticator);
    app.use(error_handler_js_1.errorHandler); // handle sync errors
}
exports.configureExpress = configureExpress;
