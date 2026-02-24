'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteActivity(activityId: string) {
  try {
    await prisma.activity.delete({
      where: {
        id: activityId,
      },
    });

    revalidatePath('/activities');
  } catch (error) {
    console.error('Error deleting activity:', error);
    throw new Error('Failed to delete activity');
  }
}
