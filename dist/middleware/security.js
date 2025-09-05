"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const sanitizeMiddleware_1 = __importDefault(require("./sanitizeMiddleware"));
const applySecurityMiddleware = (app) => {
    const corsOptions = {
        origin: "http://localhost:3000",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    };
    app.use((0, cors_1.default)(corsOptions));
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.use(sanitizeMiddleware_1.default);
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: {
            success: false,
            message: "Too many requests from this IP, please try again after 15 minutes",
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(limiter);
};
exports.default = applySecurityMiddleware;
