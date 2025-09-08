import jwt from "jsonwebtoken";
import AppError from "../errors/appError";
import status from "http-status";
import logger from "./logger";

const verifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    logger.error("VerifyTokenError:",err)
    throw new AppError("Invalid or expired token", status.UNAUTHORIZED);
  }
};

export default verifyToken;
