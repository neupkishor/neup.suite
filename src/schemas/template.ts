
import { z } from 'zod';

export const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  type: z.enum(['Project', 'TaskList', 'Document']),
  data: z.record(z.any(), {
    invalid_type_error: 'Template data must be a JSON object',
  }),
  clientId: z.string().optional(), // Can be null for global templates
});

export type Template = z.infer<typeof templateSchema> & { id: string };
