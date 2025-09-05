"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xss_1 = __importDefault(require("xss"));
const sanitizeMiddleware = (req, res, next) => {
    // Sanitize body
    if (req.body) {
        for (const key in req.body) {
            if (typeof req.body[key] === "string") {
                req.body[key] = (0, xss_1.default)(req.body[key]);
            }
        }
    }
    // Sanitize query
    if (req.query) {
        for (const key in req.query) {
            if (typeof req.query[key] === "string") {
                req.query[key] = (0, xss_1.default)(req.query[key]);
            }
        }
    }
    // Sanitize params
    if (req.params) {
        for (const key in req.params) {
            if (typeof req.params[key] === "string") {
                req.params[key] = (0, xss_1.default)(req.params[key]);
            }
        }
    }
    next();
};
exports.default = sanitizeMiddleware;
