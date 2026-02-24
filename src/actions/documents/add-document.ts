'use server';

import { prisma } from '@/lib/prisma';
import { documentSchema } from '@/schemas/document';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

type NewDocument = z.infer<typeof documentSchema>;

export async function addDocument(documentData: NewDocument) {
  try {
    const newDocument = await prisma.document.create({
      data: {
        title: documentData.name,
        file_url: documentData.url,
        version: documentData.version,
        status: documentData.status,
        file_type: documentData.fileType,
        size: documentData.size,
        uploaded_by: documentData.uploadedBy,
        notes: documentData.notes,
        clientId: documentData.clientId,
      },
    });

    revalidatePath('/documents');
    return newDocument;
  } catch (error) {
    console.error('Error creating document:', error);
    throw new Error('Failed to create document');
  }
}
