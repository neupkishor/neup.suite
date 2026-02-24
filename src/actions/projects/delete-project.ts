'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteProject(projectId: string) {
  try {
    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    revalidatePath('/projects');
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
}
