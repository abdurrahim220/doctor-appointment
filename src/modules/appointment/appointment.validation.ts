import z from "zod";
import { zodEnumFromTSWithDefault } from "../../helpers/zodEnumForm";
import { AppointmentStatus, ScheduleType } from "../../types/schema.types";

const appointmentZodSchema = z.object({
  date: z.string(),
  status: zodEnumFromTSWithDefault(AppointmentStatus, AppointmentStatus.PENDING),
  notes: z.string().optional(),
  patientId: z.string(),
  doctorId: z.string(),
  scheduleId: z.string(),
  clinicId: z.string(),
  scheduleType: zodEnumFromTSWithDefault(ScheduleType, ScheduleType.AVAILABLE),
});

const appointmentZodUpdateSchema = appointmentZodSchema.partial();

export const appointmentZodValidate = {
  create: appointmentZodSchema,
  update: appointmentZodUpdateSchema,
};
