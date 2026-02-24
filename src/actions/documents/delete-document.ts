'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteDocument(documentId: string) {
  try {
    await prisma.document.delete({
      where: {
        id: documentId,
      },
    });
    
    revalidatePath('/documents');
  } catch (error) {
    console.error('Error deleting document:', error);
    throw new Error('Failed to delete document');
  }
}
