"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, printf, colorize, errors } = winston_1.format;
// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});
// Logger instance
const logger = (0, winston_1.createLogger)({
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
    format: combine(colorize(), // colors in dev
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), // log stack trace
    logFormat),
    transports: [
        new winston_1.transports.Console(), // show in console
        new winston_1.transports.File({ filename: "logs/error.log", level: "error" }), // save errors
        new winston_1.transports.File({ filename: "logs/combined.log" }), // save all logs
    ],
});
exports.default = logger;
