import asyncHandler from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { authServices } from "./auth.services";
import verifyToken from "../../utils/verifyToken";
import jwt from "jsonwebtoken";

const login = asyncHandler(async (req: Request, res: Response, _next) => {
  const result = await authServices.login(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "login success",
    data: result,
  });
});
const logout = asyncHandler(async (req: Request, res: Response, _next) => {
  const token = req.cookies.refreshToken;
  await authServices.logout(token);
  if (token) {
    res.clearCookie("refreshToken");
  }
  sendResponse(res, {
    statusCode: status.NO_CONTENT,
    success: true,
    message: "logout success",
    data: {},
  });
});

const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new Error("No refresh token provided");

  const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET as string);

  const newAccessToken = jwt.sign(
    { decoded },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: "15m" },
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Token refreshed",
    data: { accessToken: newAccessToken },
  });
});

export const authController = {
  login,
  logout,
  refresh,
};
