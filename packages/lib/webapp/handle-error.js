"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const errors_js_1 = require("../utils/errors.js");
const logger_js_1 = require("../utils/logger.js");
function handleError(err, res) {
    const status = err instanceof errors_js_1.ApplicationError ? err.status : errors_js_1.HTTP_NOT_FOUND;
    const payload = err instanceof errors_js_1.ApplicationError ? err.payload : undefined;
    const message = err.message ?? err.name ?? 'Unknown error';
    res.status(status).json({ status: 'error', message, payload });
    logger_js_1.logger.error(message);
}
exports.handleError = handleError;
