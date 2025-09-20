import { DayOfWeek } from "@prisma/client";

export const schedules = [
  {
    id: "schedule-1",
    doctorId: "doctor-profile-1",
    clinicId: "clinic-1",
    date: new Date("2025-10-22"),
    startTime: new Date("2025-10-22T16:00:00.000Z"),
    endTime: new Date("2025-10-22T22:00:00.000Z"),
    maxPatients: 10,
    slotDuration: 30,
    timezone: "Asia/Dhaka",
    dayOfWeek: [DayOfWeek.WEDNESDAY, DayOfWeek.SATURDAY],
    isAvailable: true,
  },
  {
    id: "schedule-2",
    doctorId: "doctor-profile-1",
    clinicId: "clinic-1",
    date: new Date("2025-10-23"),
    startTime: new Date("2025-10-23T16:00:00.000Z"),
    endTime: new Date("2025-10-23T22:00:00.000Z"),
    maxPatients: 10,
    slotDuration: 30,
    timezone: "Asia/Dhaka",
    dayOfWeek: [DayOfWeek.THURSDAY, DayOfWeek.SATURDAY],
    isAvailable: false,
  },
];
