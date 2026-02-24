import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  project: z.string().optional(),
  assignees: z.array(z.string()).default([]),
  deadline: z.date().optional(),
  status: z.enum(['To Do', 'In Progress', 'Done', 'Cancelled']),
  subtasks: z.array(z.object({ text: z.string(), completed: z.boolean() })).optional(),
  clientId: z.string().optional(),
});

export type Task = z.infer<typeof taskSchema> & { id: string };
