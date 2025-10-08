import { z } from 'zod';

export const documentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  url: z.string().url(),
  version: z.string().optional(),
  status: z.enum(['Signed', 'Approved', 'In Review', 'Archived']),
});

export type Document = z.infer<typeof documentSchema> & { id: string };
