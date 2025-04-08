import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title cannot exceed 200 characters"),
  body: z.string().min(10, "Body must be at least 10 characters"), // No max limit
});
