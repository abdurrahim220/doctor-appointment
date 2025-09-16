
export type ISchedule ={
    id:string;
    doctorId:string;
    startTime:Date;
    endTime:Date;
    isAvailable:boolean;
    clinicId:string;
    createdAt:Date;
    updatedAt:Date;
}