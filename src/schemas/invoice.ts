import { z } from 'zod';

export const invoiceSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  clientName: z.string().min(1, 'Client name is required'),
  amount: z.number({ required_error: 'Amount is required' }).positive('Amount must be positive'),
  currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'NRS']),
  dueDate: z.date({ required_error: 'Due date is required' }),
  status: z.enum(['Paid', 'Due', 'Overdue']),
  clientId: z.string().min(1, 'Client ID is required'),
});

    