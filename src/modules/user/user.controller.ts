import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const createUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const getAllUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getAllUser();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: `Users retrieved successfully from ${result.source}`,
    data: result,
  });
});

const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getUserById(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: `User retrieved successfully from ${result.source}`,
    data: result,
  });
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.updateUser(req.params.id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const userController = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
};
