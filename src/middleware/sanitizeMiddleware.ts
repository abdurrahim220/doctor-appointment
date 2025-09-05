import { Request, Response, NextFunction } from "express";
import xss from "xss";

const sanitizeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize body
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }

  // Sanitize query
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === "string") {
        req.query[key] = xss(req.query[key] as string);
      }
    }
  }

  // Sanitize params
  if (req.params) {
    for (const key in req.params) {
      if (typeof req.params[key] === "string") {
        req.params[key] = xss(req.params[key]);
      }
    }
  }

  next();
};

export default sanitizeMiddleware;
