'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { taskSchema } from '@/schemas/task';
import { z } from 'zod';

// Partial schema for updates
const updateTaskSchema = taskSchema.partial().extend({
  id: z.string(),
});

export async function updateTask(data: z.infer<typeof updateTaskSchema>) {
  const { id, title, description, project, assignees, deadline, status, subtasks, clientId } = data;

  try {
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (assignees !== undefined) updateData.assigned_to = assignees;
    if (deadline !== undefined) updateData.deadline = deadline;
    
    if (clientId !== undefined) updateData.clientId = clientId;
    
    // Handle references updates
    if (clientId !== undefined || project !== undefined) {
      const currentTask = await prisma.task.findUnique({
        where: { id },
        select: { references: true }
      });
      
      let newReferences = currentTask?.references || [];
      
      if (clientId !== undefined) {
        newReferences = newReferences.filter((r: string) => !r.startsWith('client.id.'));
        newReferences.push(`client.id.${clientId}`);
      }
      
      if (project !== undefined) {
        newReferences = newReferences.filter((r: string) => !r.startsWith('project.id.'));
        if (project) {
          newReferences.push(`project.id.${project}`);
        }
      }
      
      updateData.references = newReferences;
    }
    
    // Handle subtasks if provided - manual delete and create
    if (subtasks !== undefined) {
      await prisma.subtask.deleteMany({
        where: { taskId: id }
      });
      
      if (subtasks.length > 0) {
        await prisma.subtask.createMany({
          data: subtasks.map((s) => ({
            text: s.text,
            completed: s.completed,
            taskId: id,
          })),
        });
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/tasks');
    return { success: true, task };
  } catch (error) {
    console.error('Failed to update task:', error);
    throw new Error('Failed to update task');
  }
}
