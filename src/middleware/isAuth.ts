import { NextFunction, Response, Request } from "express";
import { IUserRole } from "../modules/user/user.interface";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../errors/appError";
import status from "http-status";
import verifyToken from "../utils/verifyToken";
import { config } from "../config";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../prisma/client";

const isAuth = (requiredRole: IUserRole[]) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    

    if (!token) {
      throw new AppError("You are not authorized", status.UNAUTHORIZED);
    }

    const decoded = verifyToken(token, config.jwt_secret as string);

    const { role, userId } = decoded as JwtPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new AppError("You are not authorized", status.UNAUTHORIZED);
    }

    const isDeleted = user?.isDeleted;
    if (isDeleted) {
      throw new AppError("You are not authorized", status.UNAUTHORIZED);
    }

    const isActive = user?.isActive;
    if (!isActive) {
      throw new AppError("You are not authorized", status.UNAUTHORIZED);
    }

    if (requiredRole && !requiredRole.includes(role)) {
      throw new AppError("You are not authorized", status.UNAUTHORIZED);
    }

    req.user = decoded as JwtPayload;

    next();
  });
};

export default isAuth;
