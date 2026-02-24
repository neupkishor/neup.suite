'use server';

import { prisma } from '@/lib/prisma';
import { feedbackSchema } from '@/schemas/feedback';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

type NewFeedback = z.infer<typeof feedbackSchema>;

export async function addFeedback(feedbackData: NewFeedback) {
  try {
    const newFeedback = await prisma.feedback.create({
      data: {
        title: feedbackData.title,
        comment: feedbackData.comment,
        clientId: feedbackData.clientId,
      },
    });

    revalidatePath('/feedback');
    return newFeedback;
  } catch (error) {
    console.error('Error creating feedback:', error);
    throw new Error('Failed to create feedback');
  }
}
