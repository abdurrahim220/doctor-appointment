import { ZodObject, ZodRawShape } from "zod";
import asyncHandler from "../utils/asyncHandler";
import { NextFunction, Request, Response } from "express";

const validateRequest = <T extends ZodRawShape>(schema: ZodObject<T>) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync(req.body);
    next();
  });
};

export default validateRequest;
