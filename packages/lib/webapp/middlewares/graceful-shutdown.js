"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGracefulShutdownMiddleware = void 0;
const handle_error_js_1 = require("../handle-error.js");
const errors_js_1 = require("../../utils/errors.js");
const logger_js_1 = require("../../utils/logger.js");
const delay_js_1 = require("../../utils/delay.js");
function createGracefulShutdownMiddleware(handler) {
    const runningRequests = new Set();
    handler.addCallback(async () => {
        logger_js_1.logger.info('waiting for ongoing requests to end...');
        while (runningRequests.size > 0) {
            await (0, delay_js_1.delay)(1000);
            logger_js_1.logger.info(`still have ${runningRequests.size} requests to handle`);
        }
        logger_js_1.logger.info('all requests ended');
    }, {
        blocking: true,
        order: -999
    });
    return (req, res, next) => {
        // decline all new requests if app is shutting down
        if (handler.isShuttingDown) {
            (0, handle_error_js_1.handleError)(new errors_js_1.ServiceUnavailableError('Maintenance'), res);
            return;
        }
        // keep track of running requests and wait for them to finish during shutdown
        runningRequests.add(req);
        const detach = () => runningRequests.delete(req);
        res.on('close', detach);
        res.on('error', detach);
        next();
    };
}
exports.createGracefulShutdownMiddleware = createGracefulShutdownMiddleware;
