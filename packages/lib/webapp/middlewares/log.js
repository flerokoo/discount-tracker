"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMiddleware = void 0;
const logger_js_1 = require("../../utils/logger.js");
function logMiddleware(req, res, next) {
    const logOnFinish = () => {
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${req.ip}`;
        logger_js_1.logger.info(message);
    };
    res.on('finish', logOnFinish);
    next();
}
exports.logMiddleware = logMiddleware;
