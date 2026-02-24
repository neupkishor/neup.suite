'use server';

import { prisma } from '@/lib/prisma';
import { clientSchema } from '@/schemas/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function createClient(data: z.infer<typeof clientSchema>, userId: string) {
  if (!userId) {
    return { success: false, error: 'User not authenticated' };
  }

  const result = clientSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: 'Invalid data' };
  }

  const { name, status } = result.data;

  try {
    const client = await prisma.client.create({
      data: {
        name,
        status: status || 'Onboarding', // Default status if not provided
        created_by: userId,
        owner_id: userId,
      },
    });

    revalidatePath('/clients');
    return { success: true, client };
  } catch (error) {
    console.error('Failed to create client:', error);
    return { success: false, error: 'Failed to create client' };
  }
}
