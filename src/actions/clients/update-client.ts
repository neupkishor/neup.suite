'use server';

import { prisma } from '@/lib/prisma';
import { clientSchema } from '@/schemas/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function updateClient(id: string, data: Partial<z.infer<typeof clientSchema>>) {
  try {
    const { name, status } = data;
    
    const client = await prisma.client.update({
      where: { id },
      data: {
        name,
        status,
      },
    });

    revalidatePath('/clients');
    revalidatePath(`/clients/${id}`);
    return { success: true, client };
  } catch (error) {
    console.error('Failed to update client:', error);
    return { success: false, error: 'Failed to update client' };
  }
}
