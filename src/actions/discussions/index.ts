'use server';

import { prisma } from '@/lib/prisma';
import { discussionSchema } from '@/schemas/discussion';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

type NewDiscussion = z.infer<typeof discussionSchema>;
type UpdatedDiscussion = z.infer<typeof discussionSchema>;

export async function addDiscussion(discussionData: NewDiscussion) {
  try {
    const newDiscussion = await prisma.discussion.create({
      data: {
        title: discussionData.title,
        clientId: discussionData.clientId,
      },
    });

    revalidatePath('/discussions');
    return newDiscussion;
  } catch (error) {
    console.error('Error creating discussion:', error);
    throw new Error('Failed to create discussion');
  }
}

export async function updateDiscussion(discussionId: string, discussionData: UpdatedDiscussion) {
  try {
    const updatedDiscussion = await prisma.discussion.update({
      where: {
        id: discussionId,
      },
      data: {
        title: discussionData.title,
        clientId: discussionData.clientId,
      },
    });

    revalidatePath('/discussions');
    return updatedDiscussion;
  } catch (error) {
    console.error('Error updating discussion:', error);
    throw new Error('Failed to update discussion');
  }
}

export async function deleteDiscussion(discussionId: string) {
  try {
    await prisma.discussion.delete({
      where: {
        id: discussionId,
      },
    });

    revalidatePath('/discussions');
  } catch (error) {
    console.error('Error deleting discussion:', error);
    throw new Error('Failed to delete discussion');
  }
}
