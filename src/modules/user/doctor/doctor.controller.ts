import status from "http-status";
import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import asyncHandler from "../../../utils/asyncHandler";
import { doctorProfileService } from "./doctor.profile.services";

const createdDoctorProfile = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const id = req.user.userId;
  // console.log(id)
  const result = await doctorProfileService.createDoctorProfile(data, id);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Doctor profile created successfully",
    data: result,
  });
});

const getDoctorProfile = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user.userId;
  // console.log(id)
  const result = await doctorProfileService.getDoctorProfile(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: `Doctor profile retrieved successfully ${result.source}`,
    data: result,
  });
});

const updateDoctorProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const data = req.body;
  // console.log(userId)
  const result = await doctorProfileService.updateDoctorProfile(userId, data);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Doctor profile updated successfully",
    data: result,
  });
});

const getAllDoctors=asyncHandler(async(req:Request,res:Response)=>{
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await doctorProfileService.getAllDoctors(page, limit);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: `Doctor profiles retrieved successfully from ${result.source}`,
    data: result,
  });
})

export const doctorProfileController = {
  createdDoctorProfile,
  getDoctorProfile,
  updateDoctorProfile,
  getAllDoctors,
};
