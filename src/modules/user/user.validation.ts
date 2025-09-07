import { z } from "zod";

const userZodSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name cannot be empty"),
  email: z.email("Please provide a valid email"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  phone: z.string().min(11, "Phone number must be at least 11 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const updateUserZodSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name cannot be empty"),
  email: z.email("Please provide a valid email"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  phone: z.string().min(11, "Phone number must be at least 11 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const userValidation = {
  userZodSchema,
  updateUserZodSchema,
};
