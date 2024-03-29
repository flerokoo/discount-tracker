import { isProduction } from "./is-production.js";
import path from "node:path";
import cluster from "cluster";
import winston from "winston";
import type {} from "winston";
const format = winston.format;

const logPath = (filename: string) => path.join("logs", filename);

const transports: any[] = cluster.isPrimary
  ? [
      new winston.transports.File({ filename: logPath("error.log"), level: "error" }),
      new winston.transports.File({ filename: logPath("log.log") }),
    ]
  : [
      new winston.transports.Stream({
        stream: process.stdout,
        format: format.printf((_) => _.message),
      }),
      new winston.transports.Stream({
        stream: process.stderr,
        level: "error",
        format: format.printf((_) => _.message),
      }),
    ];

if (!isProduction() && cluster.isPrimary) {
  transports.length = 0;
  transports.push(
    new winston.transports.Console({
      format: format.combine(format.colorize(), format.cli()),
    }),
  );
}

const winstonLogger = winston.createLogger({
  level: "info",
  format: format.combine(format.json(), format.timestamp()),
  defaultMeta: { service: "api" },
  transports,
});

const logger = {
  info: (msg: string) => winstonLogger.info(msg),
  warn: (msg: string) => winstonLogger.warn(msg),
  error: (msg: string) => winstonLogger.error(msg),
};

// const logger = {
//   info: console.log,
//   warn: console.log,
//   error: console.log
// }
export { logger };
