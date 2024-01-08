"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const is_production_js_1 = require("./is-production.js");
const node_path_1 = __importDefault(require("node:path"));
const cluster_1 = __importDefault(require("cluster"));
const winston_1 = __importDefault(require("winston"));
const format = winston_1.default.format;
const logPath = (filename) => node_path_1.default.join('/logs', filename);
const transports = cluster_1.default.isPrimary
    ? [
        new winston_1.default.transports.File({ filename: logPath('error.log'), level: 'error' }),
        new winston_1.default.transports.File({ filename: logPath('log.log') })
    ]
    : [
        new winston_1.default.transports.Stream({
            stream: process.stdout,
            format: format.printf((_) => _.message)
        }),
        new winston_1.default.transports.Stream({
            stream: process.stderr,
            level: 'error',
            format: format.printf((_) => _.message)
        })
    ];
const winstonLogger = winston_1.default.createLogger({
    level: 'info',
    format: format.combine(format.json(), format.timestamp()),
    defaultMeta: { service: 'api' },
    transports
});
if (!(0, is_production_js_1.isProduction)() && cluster_1.default.isPrimary) {
    winstonLogger.add(new winston_1.default.transports.Console({
        format: format.combine(format.colorize(), format.cli())
    }));
}
const logger = {
    info: (msg) => winstonLogger.info(msg),
    warn: (msg) => winstonLogger.warn(msg),
    error: (msg) => winstonLogger.error(msg)
};
exports.logger = logger;
