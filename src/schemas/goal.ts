
import { z } from 'zod';

export const goalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  targetDate: z.date({ required_error: 'Target date is required' }),
  status: z.enum(['Not Started', 'In Progress', 'Completed', 'At Risk']),
});

export type Goal = z.infer<typeof goalSchema> & { id: string };
