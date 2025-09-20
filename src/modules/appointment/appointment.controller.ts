import asyncHandler from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const createAppointment = asyncHandler(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Appointment created successfully",
    data: {},
  });
});

const getAppointment = asyncHandler(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Appointment retrieved successfully",
    data: {},
  });
});

const updateAppointment = asyncHandler(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Appointment updated successfully",
    data: {},
  });
});

const deleteAppointment = asyncHandler(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Appointment deleted successfully",
    data: {},
  });
});

const getAllAppointments = asyncHandler(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Appointments retrieved successfully",
    data: {},
  });
});

export const appointmentController = {
  createAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
};
