import { z } from 'zod';

export const invoiceSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice ID is required'),
  clientName: z.string().min(1, 'Client name is required'),
  amount: z.number({ required_error: 'Amount is required' }).positive('Amount must be positive'),
  dueDate: z.date({ required_error: 'Due date is required' }),
  status: z.enum(['Paid', 'Due', 'Overdue']),
});
