import { DayOfWeek } from "../../types/schema.types";

export type ISchedule ={
    id:string;
    doctorId:string;
    date:string;
    startTime:string;
    endTime:string;
    isAvailable:boolean;
    maxPatients:number;
    slotDuration:number;
    dayOfWeek:DayOfWeek[];
    clinicId:string;
    timezone:string;
    createdAt:Date;
    updatedAt:Date;
}