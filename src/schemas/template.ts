
import { z } from 'zod';

export const taskListItemSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
});

export const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  type: z.enum(['Project', 'TaskList', 'Document', 'Report']),
  body: z.string().min(1, 'Body is required'),
  version: z.number().default(1),
  clientId: z.string().min(1, 'Client ID is required'),
});

export type Template = z.infer<typeof templateSchema> & { id: string };
export type TaskListItem = z.infer<typeof taskListItemSchema>;
