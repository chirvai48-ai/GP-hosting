import { z } from "zod";

export const newsStatusEnum = z.enum(["published", "closed"]);

export const createNewsSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(255, "Title is too long"),

  body: z
    .string()
    .min(20, "Body must be at least 20 characters"),

  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(500, "Summary is too long"),

  admin_id: z.string().min(1).optional(),

  status: newsStatusEnum,

  image_key: z.string().min(1, "Image is required"),
  image_type: z.string().min(1, "Image type is required"),
});

export type CreateNewsForm = z.infer<typeof createNewsSchema>;