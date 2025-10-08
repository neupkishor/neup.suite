
import { z } from 'zod';

export const reportSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().min(1, 'Summary is required'),
  clientId: z.string().min(1, 'Client ID is required'),
});
