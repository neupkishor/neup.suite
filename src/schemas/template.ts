
import { z } from 'zod';

export const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  type: z.enum(['Project', 'TaskList', 'Document']),
  data: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch (e) {
      return false;
    }
  }, { message: 'Must be a valid JSON string' }),
  version: z.number().default(1),
  clientId: z.string().min(1, 'Client ID is required'),
});

export type Template = z.infer<typeof templateSchema> & { id: string };

    