import z from "zod";

const createClinicZodSchema = z.object({
  name: z.string({
    "message": "Clinic name is required"
  }),
  address: z.string({
    "message": "Clinic address is required"
  }),
});

const assignDoctorToClinicZodSchema = z.object({
  clinicId: z.string({
    "message": "Clinic id is required"
  }),
  doctorId: z.string({
    "message": "Doctor id is required"
  }),
});

const assignNurseToClinicZodSchema = z.object({
  clinicId: z.string({
    "message": "Clinic id is required"
  }),
  nurseId: z.string({
    "message": "Nurse id is required"
  }),
});

export const clinicZodValidation = {
  createClinicZodSchema,
  assignDoctorToClinicZodSchema,
  assignNurseToClinicZodSchema,
};
