'use server';

import { prisma } from '@/lib/prisma';
import { activitySchema } from '@/schemas/activity';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

type NewActivity = z.infer<typeof activitySchema>;

export async function addActivity(activityData: NewActivity) {
  try {
    const newActivity = await prisma.activity.create({
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
    return newActivity;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw new Error('Failed to create activity');
  }
}
