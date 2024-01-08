"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graceful_shutdown_handler_1 = __importDefault(require("@flerokoo/graceful-shutdown-handler"));
const gracefulShutdownHandler = new graceful_shutdown_handler_1.default();
gracefulShutdownHandler.enable();
exports.default = gracefulShutdownHandler;
