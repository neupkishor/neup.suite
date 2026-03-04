'use server';

import { prisma } from '@/lib/prisma';
import { projectSchema } from '@/schemas/project';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getSession } from '../auth/session';

type NewProject = Omit<z.infer<typeof projectSchema>, 'deadline'> & {
  deadline: string;
};

export async function createProject(projectData: NewProject) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const newProject = await prisma.project.create({
      data: {
        name: projectData.name,
        deadline: new Date(projectData.deadline),
        status: projectData.status,
        clientId: projectData.clientId === 'no-client' ? null : projectData.clientId,
        working_with: projectData.clientId === 'no-client' ? null : projectData.clientId,
        project_owner: session.account_id,
      },
    });

    revalidatePath('/projects');
    return { success: true, project: newProject };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create project' };
  }
}
