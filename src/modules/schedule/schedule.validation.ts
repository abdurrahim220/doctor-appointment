import z from "zod";

const scheduleZodSchema = z.object({
  doctorId: z.string({
    message: "Doctor id is required",
  }),
  clinicId: z.string({
    message: "Clinic id is required",
  }),
  startTime: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date must be in YYYY-MM-DD format",
  }),
  endTime: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date must be in YYYY-MM-DD format",
  }),
  isAvailable: z.boolean().default(true),
});



export const scheduleZodValidation = {
  scheduleZodSchema,
};
