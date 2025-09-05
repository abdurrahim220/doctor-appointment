"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const library_1 = require("@prisma/client/runtime/library");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
const http_status_1 = __importDefault(require("http-status"));
const zod_1 = require("zod");
const globalErrorHandler = (err, req, res, _next) => {
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorMessages = [
        {
            path: "",
            message: "Internal server error!",
        },
    ];
    if (err instanceof zod_1.ZodError) {
        statusCode = http_status_1.default.BAD_REQUEST;
        message = "Validation error";
        errorMessages = err.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message,
        }));
    }
    // ✅ Prisma known request errors
    else if (err instanceof library_1.PrismaClientKnownRequestError) {
        // Duplicate (unique constraint failed)
        if (err.code === "P2002") {
            statusCode = http_status_1.default.BAD_REQUEST;
            message = `Duplicate value for field(s): ${err.meta?.target}`;
            errorMessages = [
                {
                    path: err.meta?.target?.toString() || "",
                    message,
                },
            ];
        }
        // Foreign key constraint failed
        else if (err.code === "P2003") {
            statusCode = http_status_1.default.BAD_REQUEST;
            message = "Foreign key constraint failed";
            errorMessages = [
                {
                    path: "",
                    message,
                },
            ];
        }
        // Record not found
        else if (err.code === "P2025") {
            statusCode = http_status_1.default.NOT_FOUND;
            message = "Record not found!";
            errorMessages = [
                {
                    path: "",
                    message,
                },
            ];
        }
    }
    // ✅ Prisma validation error
    else if (err instanceof library_1.PrismaClientValidationError) {
        statusCode = http_status_1.default.BAD_REQUEST;
        message = "Validation error";
        errorMessages = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    // ✅ If error already has statusCode/message (e.g. AppError)
    else if (err && typeof err === "object" && "statusCode" in err && "message" in err) {
        const e = err;
        statusCode = e.statusCode;
        message = e.message;
        errorMessages = [
            {
                path: "",
                message: e.message,
            },
        ];
    }
    // ✅ If error is a token error
    else if (err instanceof jsonwebtoken_1.TokenExpiredError || err instanceof jsonwebtoken_1.JsonWebTokenError) {
        statusCode = 401;
        message = "Unauthorized";
        errorMessages = [
            {
                path: "",
                message,
            },
        ];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources: errorMessages,
        stack: config_1.config.node_env === "development"
            ? err instanceof Error
                ? err.stack
                : undefined
            : undefined,
    });
};
exports.default = globalErrorHandler;
