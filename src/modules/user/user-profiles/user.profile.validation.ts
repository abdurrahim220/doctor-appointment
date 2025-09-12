import { z } from "zod";

// ✅ Create schema: only dateOfBirth required
const createPatientProfileZodSchema = z.object({
  dateOfBirth: z
    .string({ message: "Date of birth is required in dd/mm/yyyy format" })
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date of birth must be in dd/mm/yyyy format"),
  isActive: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

// ✅ Update schema: all fields optional (partial)
const updatePatientProfileZodSchema = createPatientProfileZodSchema.partial();

export const subUserValidation = {
  createPatientProfileZodSchema,
  updatePatientProfileZodSchema,
};
