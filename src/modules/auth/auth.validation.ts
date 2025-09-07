import z from "zod";

const loginZodSchema = z.object({
  email: z.string({
    message: "email is required",
  }),
  password: z.string({
    message: "password is required",
  }),
});

export const authValidation = {
    loginZodSchema
}
