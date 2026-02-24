'use server';

import { prisma } from '@/lib/prisma';
import { projectSchema } from '@/schemas/project';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

type UpdatedProject = Partial<Omit<z.infer<typeof projectSchema>, 'deadline'> & {
    deadline: string;
}>;

export async function updateProject(projectId: string, projectData: UpdatedProject) {
  try {
    const data: any = {};
    
    if (projectData.name) data.name = projectData.name;
    if (projectData.deadline) data.deadline = new Date(projectData.deadline);
    if (projectData.clientId !== undefined) data.clientId = projectData.clientId === 'no-client' ? null : projectData.clientId;
    if (projectData.status) data.status = projectData.status;

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: data,
    });
    
    revalidatePath('/projects');
    return updatedProject;
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
}
