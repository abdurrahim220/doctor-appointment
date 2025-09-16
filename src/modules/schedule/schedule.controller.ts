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

const getSchedule= asyncHandler(async(req:Request,res:Response)=>{


    sendResponse(res,{
        statusCode:status.CREATED,
        success:true,
        message:"Schedule fetched successfully",
        data:{}
    })
})

const updateSchedule= asyncHandler(async(req:Request,res:Response)=>{


    sendResponse(res,{
        statusCode:status.CREATED,
        success:true,
        message:"Schedule updated successfully",
        data:{}
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
    getSchedule,
    updateSchedule,
    deleteSchedule
}