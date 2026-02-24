'use server';

import { prisma } from '@/lib/prisma';
import { invoiceSchema } from '@/schemas/invoice';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

type UpdatedInvoice = Omit<z.infer<typeof invoiceSchema>, 'dueDate'> & {
  dueDate: string;
};

export async function updateInvoice(invoiceId: string, invoiceData: UpdatedInvoice) {
  try {
    const updatedInvoice = await prisma.invoice.update({
      where: {
        id: invoiceId,
      },
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
    return updatedInvoice;
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw new Error('Failed to update invoice');
  }
}
