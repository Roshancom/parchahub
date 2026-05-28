import { z } from "zod";

export const pamphletSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  thumbnail_image: z.any().optional(),
  content: z.string().optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    city: z.string().trim().min(1, "City is required"),
  }),
  url_key: z.string().trim().min(1, "URL key is required"),
  short_description: z.string().optional(),
  category: z.string().trim().min(1, "Category is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  email: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Invalid email",
    }),
});
