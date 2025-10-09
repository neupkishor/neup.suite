
import { z } from 'zod';

export const reportSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'HTML content is required'),
  clientId: z.string().min(1, 'Client ID is required'),
  templateId: z.string().optional(),
  manualData: z.record(z.string(), z.any()).optional(),
  generatedOn: z.any().optional(),
});

export type Report = z.infer<typeof reportSchema> & { id: string, generatedOn: any };
