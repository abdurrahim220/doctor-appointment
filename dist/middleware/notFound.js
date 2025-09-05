"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
class NotFoundError extends Error {
    constructor(path) {
        super(`Resource not found at - ${path}`);
        this.name = "NotFoundError";
    }
}
const notFound = (req, res) => {
    const error = new NotFoundError(req.originalUrl);
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: error.message,
        errorMessage: [
            {
                path: req.originalUrl,
                message: error.message,
            },
        ],
    });
};
exports.default = notFound;
