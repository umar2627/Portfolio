import { z } from "zod";

export const reviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.string().max(255).optional().or(z.literal("")),
  company: z.string().max(255).optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  rating: z.number().min(1).max(5),
  review_text: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(2000),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
