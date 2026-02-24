'use server';

import { prisma } from '@/lib/prisma';
import { feedbackSchema } from '@/schemas/feedback';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

type UpdatedFeedback = z.infer<typeof feedbackSchema>;

export async function updateFeedback(feedbackId: string, feedbackData: UpdatedFeedback) {
  try {
    const updatedFeedback = await prisma.feedback.update({
      where: {
        id: feedbackId,
      },
      data: {
        title: feedbackData.title,
        comment: feedbackData.comment,
        clientId: feedbackData.clientId,
      },
    });

    revalidatePath('/feedback');
    return updatedFeedback;
  } catch (error) {
    console.error('Error updating feedback:', error);
    throw new Error('Failed to update feedback');
  }
}
