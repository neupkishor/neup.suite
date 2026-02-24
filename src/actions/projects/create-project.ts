'use server';

import { prisma } from '@/lib/prisma';
import { projectSchema } from '@/schemas/project';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

type NewProject = Omit<z.infer<typeof projectSchema>, 'deadline'> & {
  deadline: string;
};

export async function createProject(projectData: NewProject, userId: string) {
  try {
    const newProject = await prisma.project.create({
      data: {
        name: projectData.name,
        deadline: new Date(projectData.deadline),
        status: projectData.status,
        clientId: projectData.clientId === 'no-client' ? null : projectData.clientId,
      },
    });

    revalidatePath('/projects');
    return newProject;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
}
