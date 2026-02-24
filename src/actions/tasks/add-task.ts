'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { taskSchema } from '@/schemas/task';
import { z } from 'zod';
import { parseThreadContent } from '@/lib/thread-parser';

export async function addTask(data: z.infer<typeof taskSchema>) {
  const { title, description, project, assignees, deadline, status, subtasks, clientId } = data;

  try {
    const references: string[] = [];
    if (clientId) references.push(`client.id.${clientId}`);
    if (project) references.push(`project.id.${project}`);

    // Parse description for commands and references
    const { 
      references: parsedRefs, 
      assigned_to: parsedAssignees,
      mentioned_users, 
      deadline: parsedDeadline,
      status: parsedStatus,
      priority: parsedPriority,
      labels: parsedLabels,
      tags: parsedTags,
    } = parseThreadContent(description || '');

    // TODO: Handle mentioned_users notifications here or after creation

    // Merge parsed references
    parsedRefs.forEach(ref => {
      if (!references.includes(ref)) {
        references.push(ref);
      }
    });

    // Merge assignees
    const finalAssignees = [...(assignees || [])];
    parsedAssignees.forEach(assignee => {
      if (!finalAssignees.includes(assignee)) {
        finalAssignees.push(assignee);
      }
    });

    // Determine final deadline (explicit > parsed)
    const finalDeadline = parsedDeadline || deadline || null;
    
    // Determine final status (explicit > parsed > default)
    // Map status strings if needed (e.g. 'todo' -> 'To Do')
    let finalStatus = parsedStatus || status || 'To Do';
    if (finalStatus === 'todo') finalStatus = 'To Do';
    if (finalStatus === 'in-progress') finalStatus = 'In Progress';
    if (finalStatus === 'completed') finalStatus = 'Done';
    if (finalStatus === 'cancelled') finalStatus = 'Cancelled';
    if (finalStatus === 'reviewing') finalStatus = 'In Progress'; // Map reviewing to In Progress for now

    const task = await prisma.task.create({
      data: {
        title,
        description,
        assigned_to: finalAssignees,
        deadline: finalDeadline,
        status: finalStatus,
        priority: parsedPriority || null,
        labels: parsedLabels || [],
        tags: parsedTags || [],
        references,
        clientId,
      },
    });

    if (subtasks && subtasks.length > 0) {
      await prisma.subtask.createMany({
        data: subtasks.map((s) => ({
          text: s.text,
          completed: s.completed,
          taskId: task.id,
        })),
      });
    }

    revalidatePath('/tasks');
    return { success: true, task };
  } catch (error) {
    console.error('Failed to create task:', error);
    throw new Error('Failed to create task');
  }
}
