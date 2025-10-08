
import { z } from 'zod';

export const feedbackSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  comment: z.string().min(1, 'Comment is required'),
});
