
import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  identifier: z.string().regex(/^[a-z0-9-]+$/, {
    message: "Identifier must be lowercase letters, numbers, and dashes only.",
  }),
  deadline: z.date({
    required_error: "A deadline is required.",
  }),
  status: z.enum(['Planning', 'In Progress', 'On Hold', 'Completed']),
});
