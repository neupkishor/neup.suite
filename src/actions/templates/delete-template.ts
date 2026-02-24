'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteTemplate(templateId: string) {
  try {
    await prisma.template.delete({
      where: {
        id: templateId,
      },
    });
    
    revalidatePath('/templates');
  } catch (error) {
    console.error('Error deleting template:', error);
    throw new Error('Failed to delete template');
  }
}
