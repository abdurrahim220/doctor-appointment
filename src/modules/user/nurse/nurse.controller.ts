import status from "http-status";
import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import asyncHandler from "../../../utils/asyncHandler";
import { nurseProfileService } from "./nurse.profile.services";

const createdNurseProfile = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const id = req.user.userId;
  // console.log(id)
  const result = await nurseProfileService.createNurseProfile(data, id);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Nurse profile created successfully",
    data: result,
  });
});

const getNurseProfile = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user.userId;
  // console.log(id)
  const result = await nurseProfileService.getNurseProfile(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    // message: `Doctor profile retrieved successfully ${result.source}`,
    data: result,
  });
});

const updateNurseProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const data = req.body;
  // console.log(userId)
  const result = await nurseProfileService.updateNurseProfile(userId, data);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Nurse profile updated successfully",
    data: result,
  });
});

export const nurseProfileController = {
  createdNurseProfile,
  getNurseProfile,
  updateNurseProfile,
};
