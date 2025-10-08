import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  contactEmail: z.string().email('Invalid email address').optional(),
  status: z.enum(['Active', 'Inactive', 'Onboarding']),
});

export type Client = z.infer<typeof clientSchema> & { id: string };
