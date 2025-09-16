import asyncHandler from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { clinicService } from "./clinic.service";


const createClinic = asyncHandler(async (req: Request, res: Response) => {
  const clinic = await clinicService.createClinic(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Clinic created successfully",
    data: clinic,
  });
});


const assignDoctorToClinic = asyncHandler(async (req: Request, res: Response) => {
  const result = await clinicService.assignDoctorToClinic(req.body);
    sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Doctor assigned to clinic successfully",
    data: result,
  });
});

const assignNurseToClinic = asyncHandler(async (req: Request, res: Response) => {
  const result = await clinicService.assignNurseToClinic(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Nurse assigned to clinic successfully",
    data: result,
  });
});

const getClinic = asyncHandler(async (req: Request, res: Response) => {
  const result = await clinicService.getClinic(req.params.id);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Clinic retrieved successfully",
    data: result,
  });
});

const getClinicWithStaff = asyncHandler(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Clinic retrieved successfully",
    data: {},
  });
});

const getAllClinic = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.params.page) || 1;
  const limit = Number(req.params.limit)||10;
  const result = await clinicService.getAllClinic(page,limit)
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Clinic retrieved successfully",
    data: result,
  });
});





export const clinicController = {
  createClinic,
  assignDoctorToClinic,
  assignNurseToClinic,
  getClinic,
  getClinicWithStaff,
  getAllClinic,
 
};
