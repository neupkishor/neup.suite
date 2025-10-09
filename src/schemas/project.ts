
import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  deadline: z.date({
    required_error: "A deadline is required.",
  }),
  status: z.enum(['Planning', 'In Progress', 'On Hold', 'Completed']),
  clientId: z.string().optional(),
});
