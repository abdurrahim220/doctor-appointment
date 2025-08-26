import { ZodObject } from "zod";
import asyncHandler from "../utils/asyncHandler";

const validateRequest = (schema: ZodObject<any>) => {
  return asyncHandler(async (req, res, next) => {
    await schema.parseAsync(req.body);
    next();
  });
};

export default validateRequest;
