import z from "zod";
import { zodEnumFromTSWithDefault } from "../../../helpers/zodEnumForm";
import { ProfileStatus } from "../../../types/schema.types";


const createNurseZodSchema = z.object({
  licenseNumber: z.string(),
  status:zodEnumFromTSWithDefault(ProfileStatus,ProfileStatus.ACTIVE)
});

const updateNurseZodSchema = createNurseZodSchema.partial();

export const nurseZodValidation = {
  createNurseZodSchema,
  updateNurseZodSchema,
}
