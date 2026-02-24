'use server';

import { prisma } from '@/lib/prisma';
import { activitySchema } from '@/schemas/activity';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

type UpdatedActivity = z.infer<typeof activitySchema>;

export async function updateActivity(activityId: string, activityData: UpdatedActivity) {
  try {
    const updatedActivity = await prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        title: activityData.title,
        description: activityData.description,
        results: activityData.results,
        links: activityData.links || [],
        files: activityData.files ? JSON.parse(JSON.stringify(activityData.files)) : undefined,
        projectId: activityData.projectId,
        clientId: activityData.clientId,
      },
    });

    revalidatePath('/activities');
    return updatedActivity;
  } catch (error) {
    console.error('Error updating activity:', error);
    throw new Error('Failed to update activity');
  }
}
