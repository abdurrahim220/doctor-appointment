import z from "zod";
import { ProfileStatus, Specialty } from "../../../types/schema.types";
import { zodEnumFromTSWithDefault } from "../../../helpers/zodEnumForm";


const createDoctorZodSchema = z.object({
  specialty: z.enum(Object.values(Specialty) as [string, ...string[]]),
  licenseNumber: z.string(),
  status: zodEnumFromTSWithDefault(ProfileStatus, ProfileStatus.ACTIVE),
});
// const createDoctorZodSchema = z.object({
//   specialty: z.enum(Object.values(Specialty) as [string, ...string[]]),
//   licenseNumber: z.string(),
//   status: z
//     .enum(Object.values(ProfileStatus) as [string, ...string[]])
//     .default(ProfileStatus.ACTIVE),
// });
const updateDoctorZodSchema = createDoctorZodSchema.partial();

export const doctorZodValidation = {
  createDoctorZodSchema,
  updateDoctorZodSchema,
};
