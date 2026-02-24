'use server';

import { prisma } from '@/lib/prisma';
import { invoiceSchema } from '@/schemas/invoice';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

type NewInvoice = Omit<z.infer<typeof invoiceSchema>, 'dueDate'> & {
  dueDate: string;
};

export async function addInvoice(invoiceData: NewInvoice) {
  try {
    const newInvoice = await prisma.invoice.create({
      data: {
        invoiceId: invoiceData.invoiceId,
        title: invoiceData.title,
        description: invoiceData.description,
        clientName: invoiceData.clientName,
        amount: invoiceData.amount,
        currency: invoiceData.currency,
        dueDate: new Date(invoiceData.dueDate),
        status: invoiceData.status,
        clientId: invoiceData.clientId,
      },
    });

    revalidatePath('/billing');
    return newInvoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw new Error('Failed to create invoice');
  }
}
