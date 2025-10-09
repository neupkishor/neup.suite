
import { z } from 'zod';

export const reportSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().min(1, 'Summary is required'),
  clientId: z.string().min(1, 'Client ID is required'),
  type: z.enum(['client', 'project', 'manual']).optional(),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }).optional(),
  projectId: z.string().optional(),
  generatedOn: z.any().optional(),
});

export type Report = z.infer<typeof reportSchema> & { id: string, generatedOn: any };
