'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { parseThreadContent } from '@/lib/thread-parser';

interface CreateThreadInput {
  title?: string;
  description: string;
  parent_type: 'task' | 'discussion';
  parent_id: string;
  replied_to?: string;
}

export async function createThread({
  title,
  description,
  parent_type,
  parent_id,
  replied_to,
}: CreateThreadInput) {
  try {
    // 1. Parse content for commands and references
    const { references, assigned_to, mentioned_users, deadline, status, priority, labels, tags } = parseThreadContent(description);

    const more_info: string[] = [];

    // 2. Handle Task Updates if parent is task
    if (parent_type === 'task') {
      const task = await prisma.task.findUnique({
        where: { id: parent_id },
      });

      if (task) {
        const updates: any = {};
        
        // Status Update
        if (status) {
          // Map status if needed
          let finalStatus = status;
          if (status === 'todo') finalStatus = 'To Do';
          if (status === 'in-progress') finalStatus = 'In Progress';
          if (status === 'completed') finalStatus = 'Done';
          if (status === 'cancelled') finalStatus = 'Cancelled';
          
          if (finalStatus !== task.status) {
            more_info.push(`statusFrom:${task.status}`);
            more_info.push(`statusTo:${finalStatus}`);
            updates.status = finalStatus;
          }
        }

        // Priority Update
        if (priority && priority !== task.priority) {
          more_info.push(`priorityFrom:${task.priority || 'none'}`);
          more_info.push(`priorityTo:${priority}`);
          updates.priority = priority;
        }

        // Labels Update (Append)
        if (labels.length > 0) {
          const currentLabels = task.labels || [];
          const newLabels = labels.filter(l => !currentLabels.includes(l));
          if (newLabels.length > 0) {
            updates.labels = [...currentLabels, ...newLabels];
            newLabels.forEach(l => more_info.push(`labelAdded:${l}`));
          }
        }

        // Tags Update (Append)
        if (tags.length > 0) {
          const currentTags = task.tags || [];
          const newTags = tags.filter(t => !currentTags.includes(t));
          if (newTags.length > 0) {
            updates.tags = [...currentTags, ...newTags];
            newTags.forEach(t => more_info.push(`tagAdded:${t}`));
          }
        }

        // Deadline Update
        if (deadline) {
          const oldDeadline = task.deadline ? task.deadline.toISOString() : 'none';
          const newDeadline = deadline.toISOString();
          if (oldDeadline !== newDeadline) {
            more_info.push(`deadlineFrom:${oldDeadline}`);
            more_info.push(`deadlineTo:${newDeadline}`);
            updates.deadline = deadline;
          }
        }

        // Assignees Update (Append only as per "assigned_to in database")
        if (assigned_to.length > 0) {
          const currentAssignees = task.assigned_to || [];
          const newAssignees = assigned_to.filter(a => !currentAssignees.includes(a));
          if (newAssignees.length > 0) {
            updates.assigned_to = [...currentAssignees, ...newAssignees];
            // Log changes?
            newAssignees.forEach(a => more_info.push(`assigned:${a}`));
          }
        }

        // References Update (Append only)
        if (references.length > 0) {
          const currentRefs = task.references || [];
          const newRefs = references.filter(r => !currentRefs.includes(r));
          if (newRefs.length > 0) {
            updates.references = [...currentRefs, ...newRefs];
          }
        }

        if (Object.keys(updates).length > 0) {
          await prisma.task.update({
            where: { id: parent_id },
            data: updates,
          });
        }
      }
    }

    // 3. Create Thread
    const thread = await prisma.thread.create({
      data: {
        title: title || '',
        description,
        parent_type,
        parent_id,
        replied_to,
        references: [...references, ...mentioned_users.map(u => `user.mention.${u}`)],
        more_info,
      },
    });

    // 4. Create Notifications
    // For mentions
    if (mentioned_users.length > 0) {
      await prisma.notification.createMany({
        data: mentioned_users.map(username => ({
          type: 'mention',
          message: `You were mentioned in a thread regarding ${parent_type}: ${title || 'Update'}`,
          userId: username, // Assuming username is the ID or we can map it
          resourceId: thread.id,
          resourceType: 'thread',
        })),
      });
    }

    // For assignments
    if (assigned_to.length > 0) {
      await prisma.notification.createMany({
        data: assigned_to.map(username => ({
          type: 'assignment',
          message: `You were assigned to a task via thread: ${title || 'Update'}`,
          userId: username,
          resourceId: parent_id, // Link to task directly? Or thread?
          resourceType: 'task',
        })),
      });
    }

    revalidatePath('/tasks');
    revalidatePath(`/threads/${parent_id}`); // Assuming task detail page
    
    return { success: true, thread };
  } catch (error) {
    console.error('Failed to create thread:', error);
    return { success: false, error: 'Failed to create thread' };
  }
}
