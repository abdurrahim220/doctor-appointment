import z from "zod";
import { zodEnumFromTS } from "../../helpers/zodEnumForm";
import { DayOfWeek } from "../../types/schema.types";

const scheduleZodSchema = z.object({
  doctorId: z.string({
    message: "Doctor id is required",
  }),
  clinicId: z.string({
    message: "Clinic id is required",
  }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date must be in YYYY-MM-DD format",
  }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Start time must be in HH:mm format (24-hour)",
  }),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "End time must be in HH:mm format (24-hour)",
  }),
  dayOfWeek: zodEnumFromTS(DayOfWeek).array(),
  timezone: z.string().default("Asia/Dhaka"),
  isAvailable: z.boolean().default(true),
});

export const scheduleZodValidation = {
  scheduleZodSchema,
};
