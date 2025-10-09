
import { z } from 'zod';

export const activityFileSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

export const activitySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  results: z.string().optional(),
  links: z.array(z.string().url('Invalid URL').or(z.literal(''))).optional(),
  files: z.array(activityFileSchema).optional(),
  projectId: z.string().optional(),
  clientId: z.string().min(1, 'Client ID is required'),
});

export type Activity = z.infer<typeof activitySchema> & { id: string };
export type ActivityFile = z.infer<typeof activityFileSchema>;

    