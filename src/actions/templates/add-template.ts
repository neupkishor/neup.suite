'use server';

import { prisma } from '@/lib/prisma';
import { templateSchema } from '@/schemas/template';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

type NewTemplate = z.infer<typeof templateSchema>;

export async function addTemplate(templateData: NewTemplate) {
  try {
    const newTemplate = await prisma.template.create({
      data: {
        name: templateData.name,
        description: templateData.description,
        type: templateData.type,
        body: templateData.body,
        version: templateData.version,
        clientId: templateData.clientId,
      },
    });

    revalidatePath('/templates');
    return newTemplate;
  } catch (error) {
    console.error('Error creating template:', error);
    throw new Error('Failed to create template');
  }
}
