import status from "http-status";
import { Request, Response } from "express";

import { patientProfileService } from "./patient.profile";
import { sendResponse } from "../../../utils/sendResponse";
import asyncHandler from "../../../utils/asyncHandler";

const createdPatientProfile = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const id = req.user.userId;
  // console.log(id)
  const result = await patientProfileService.createPatientProfile(data,id);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Patient profile created successfully",
    data: result,
  });
});


const getPatientProfile = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user.userId;
  // console.log(id)
  const result = await patientProfileService.getPatientProfile(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: `Patient profile retrieved successfully ${result.source}`,
    data: result,
  });
});

const updatePatientProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const data = req.body;
  // console.log(userId)
  const result = await patientProfileService.updatePatientProfile(userId, data);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Patient profile updated successfully",
    data: result,
  });
});

export const subUserController = {
  createdPatientProfile,
  getPatientProfile,
  updatePatientProfile,
};