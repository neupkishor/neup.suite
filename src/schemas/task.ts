import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  project: z.string().min(1, 'Please select a project'),
  assignee: z.string().min(1, 'Please assign the task'),
  deadline: z.date().optional(),
  status: z.enum(['To Do', 'In Progress', 'Done', 'Cancelled']),
  subtasks: z.array(z.object({ text: z.string() })).optional(),
});
