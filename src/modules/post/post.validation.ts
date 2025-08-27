import z from "zod";

const postZodSchema = z.object({
  title: z.string().min(3, "Title can not be empty"),
  content: z.string().min(3, "Content can not be empty"),
  published: z.boolean().default(false),
  authorId: z.number().int().positive(),
});

const postUpdateZodSchema = z.object({
  title: z.string().min(3, "Title can not be empty").optional(),
  content: z.string().min(3, "Content can not be empty").optional(),
  published: z.boolean().default(false).optional(),
});

export const postValidation = {
  postZodSchema,
  postUpdateZodSchema,
};
