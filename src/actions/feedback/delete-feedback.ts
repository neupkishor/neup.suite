'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteFeedback(feedbackId: string) {
  try {
    await prisma.feedback.delete({
      where: {
        id: feedbackId,
      },
    });

    revalidatePath('/feedback');
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw new Error('Failed to delete feedback');
  }
}
