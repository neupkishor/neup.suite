
import { z } from 'zod';

export const discussionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  clientId: z.string().min(1, 'Client ID is required'),
});
