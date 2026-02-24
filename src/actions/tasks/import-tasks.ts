'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const importTasksSchema = z.object({
  templateId: z.string().min(1, "Template is required"),
  clientId: z.string().min(1, "Client is required"),
});

export async function importTasks(formData: z.infer<typeof importTasksSchema>) {
  const { templateId, clientId } = importTasksSchema.parse(formData);

  const template = await prisma.template.findUnique({
    where: { id: templateId },
  });

  if (!template) {
    throw new Error('Template not found');
  }

  if (template.type !== 'TaskList') {
    throw new Error('Invalid template type');
  }

  let tasksData;
  try {
    tasksData = JSON.parse(template.body);
  } catch (e) {
    throw new Error('Failed to parse template body');
  }

  if (!Array.isArray(tasksData)) {
    throw new Error('Template body is not an array');
  }

  const tasksToCreate = tasksData.map((t: any) => ({
    title: t.title || 'Untitled Task',
    description: t.description || '',
    references: [`client.id.${clientId}`],
    assigned_to: Array.isArray(t.assignees) ? t.assignees : [],
    clientId: clientId,
  }));

  const result = await prisma.task.createMany({
    data: tasksToCreate,
  });

  revalidatePath('/tasks');
  return { success: true, count: result.count };
}
