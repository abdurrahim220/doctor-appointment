import { NextFunction, Request, Response } from "express";
import { ErrorMessages } from "../types/error";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { config } from "../config";
import status from "http-status";
import { ZodError } from "zod";
import logger from "../utils/logger";

const globalErrorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorMessages: ErrorMessages[] = [
    {
      path: "",
      message: "Internal server error!",
    },
  ];

  if (err instanceof ZodError) {
    statusCode = status.BAD_REQUEST;
    message = "Validation error";
    errorMessages = err.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
  }
  // ✅ Prisma known request errors
  else if (err instanceof PrismaClientKnownRequestError) {
    // Duplicate (unique constraint failed)
    if (err.code === "P2002") {
      statusCode = status.BAD_REQUEST;
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
      statusCode = status.BAD_REQUEST;
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
      statusCode = status.NOT_FOUND;
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
  else if (err instanceof PrismaClientValidationError) {
    statusCode = status.BAD_REQUEST;
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
    const e = err as { statusCode: number; message: string };
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
  else if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
    statusCode = 401;
    message = "Unauthorized";
    errorMessages = [
      {
        path: "",
        message,
      },
    ];
  }
 logger.error({
    message: (err as Error).message || message,
    stack: (err as Error).stack,
    statusCode,
    errorMessages,
  });
  res.status(statusCode).json({
    success: false,
    message,
    errorSources: errorMessages,
    stack:
      config.node_env === "development"
        ? err instanceof Error
          ? err.stack
          : undefined
        : undefined,
  });
};

export default globalErrorHandler;
