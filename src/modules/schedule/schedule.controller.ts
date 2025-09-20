import asyncHandler from "../../utils/asyncHandler";
import { Request, Response } from 'express'
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { scheduleService } from "./schedule.service";

const createSchedule= asyncHandler(async(req:Request,res:Response)=>{
    const result = await scheduleService.createSchedule(req.body)
    sendResponse(res,{
        statusCode:status.CREATED,
        success:true,
        message:"Schedule created successfully",
        data:result
    })
})

const getSingleSchedule= asyncHandler(async(req:Request,res:Response)=>{

    const scheduleId = req.params.id;
    const result = await scheduleService.getSingleSchedule(scheduleId)

    sendResponse(res,{
        statusCode:status.CREATED,
        success:true,
        message:`Schedule fetched successfully from ${result.source}`,
        data:result
    })
})

const getAllSchedules = asyncHandler(async(req:Request,res:Response)=>{
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await scheduleService.getAllSchedules(page,limit)
    sendResponse(res,{
        statusCode:status.CREATED,
        success:true,
        message:`Schedules fetched successfully from ${result.source}`,
        data:result
    })
})

const updateSchedule= asyncHandler(async(req:Request,res:Response)=>{

const result = await scheduleService.updateSchedule(req.params.id,req.body)
    sendResponse(res,{
        statusCode:status.CREATED,
        success:true,
        message:"Schedule updated successfully",
        data:result
    })
})
const deleteSchedule= asyncHandler(async(req:Request,res:Response)=>{


    sendResponse(res,{
        statusCode:status.CREATED,
        success:true,
        message:"Schedule deleted successfully",
        data:{}
    })
})

export const scheduleController={
    createSchedule,
    getSingleSchedule,
    getAllSchedules,
    updateSchedule,
    deleteSchedule
}