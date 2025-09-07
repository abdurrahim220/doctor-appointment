import status from "http-status";
import AppError from "../../errors/appError";
import prisma from "../../prisma/client";
import { LoginPayload } from "./auth.interface";
import bcrypt from "bcryptjs";
import generateToken from "../../utils/generateToken";
import jwt from "jsonwebtoken";
import { blacklistRefreshToken } from "../../utils/refreshBlacklist";
import logger from "../../utils/logger";

const login = async (payload: LoginPayload) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  //  console.log(user)
  if (!user) {
    throw new AppError("user not found", status.NOT_FOUND);
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatched) {
    throw new AppError("password not matched", status.UNAUTHORIZED);
  }
  const { accessToken, refreshToken } = generateToken(user.id, user.role);
  return { accessToken, refreshToken };
};

const logout = async (refreshToken: string) => {
  try {
    const decoded = jwt.decode(refreshToken) as { exp: number } | null;
    if (decoded?.exp) {
      await blacklistRefreshToken(refreshToken, decoded.exp);
    }
  } catch (error) {
    logger.error("Error blacklisting refresh token:", error);
  }
};

export const authServices = {
  login,
  logout,
};
