'use server';

import { prisma } from '@/lib/prisma';
import { goalSchema } from '@/schemas/goal';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { GoalStatus, Prisma } from '@/generated/prisma';

type NewGoal = Omit<z.infer<typeof goalSchema>, 'targetDate'> & { targetDate: string };
type UpdatedGoal = Omit<z.infer<typeof goalSchema>, 'targetDate'> & { targetDate: string };

const STATUS_MAP: Record<string, GoalStatus> = {
  'Not Started': GoalStatus.NotStarted,
  'In Progress': GoalStatus.InProgress,
  'Completed': GoalStatus.Completed,
  'At Risk': GoalStatus.AtRisk,
};

export async function addGoal(goalData: NewGoal) {
  try {
    const status = STATUS_MAP[goalData.status] || GoalStatus.NotStarted;

    const newGoal = await prisma.goal.create({
      data: {
        title: goalData.title,
        description: goalData.description,
        targetDate: new Date(goalData.targetDate),
        status: status,
        clientId: goalData.clientId,
      },
    });

    revalidatePath('/goals');
    return newGoal;
  } catch (error) {
    console.error('Error creating goal:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new Error('Failed to create goal: The selected client does not exist.');
      }
    }
    throw new Error('Failed to create goal');
  }
}

export async function updateGoal(goalId: string, goalData: UpdatedGoal) {
  try {
    const status = STATUS_MAP[goalData.status] || GoalStatus.NotStarted;

    const updatedGoal = await prisma.goal.update({
      where: {
        id: goalId,
      },
      data: {
        title: goalData.title,
        description: goalData.description,
        targetDate: new Date(goalData.targetDate),
        status: status,
        clientId: goalData.clientId,
      },
    });

    revalidatePath('/goals');
    return updatedGoal;
  } catch (error) {
    console.error('Error updating goal:', error);
    throw new Error('Failed to update goal');
  }
}

export async function deleteGoal(goalId: string) {
  try {
    await prisma.goal.delete({
      where: {
        id: goalId,
      },
    });

    revalidatePath('/goals');
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw new Error('Failed to delete goal');
  }
}
