'use server';

import { prisma } from '@/lib/prisma';
import { clientSchema } from '@/schemas/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getSession } from '../auth/session';

export async function createClient(data: z.infer<typeof clientSchema>) {
  const session = await getSession();
  if (!session) {
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
        created_by: session.account_id,
        owner_id: session.account_id,
      },
    });

    revalidatePath('/clients');
    return { success: true, client };
  } catch (error) {
    console.error('Failed to create client:', error);
    return { success: false, error: 'Failed to create client' };
  }
}
