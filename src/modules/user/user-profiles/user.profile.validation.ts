import z from "zod";

const createPatientProfileZodSchema = z.object({
  dateOfBirth: z.string(
    {
      message: "Date of birth is required in dd/mm/yyyy format",
    }
  ),
});

const updatePatientProfileZodSchema = createPatientProfileZodSchema.omit({});

export const subUserValidation = {
  createPatientProfileZodSchema,
  updatePatientProfileZodSchema,
};
