'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteContact(contactId: string) {
  try {
    await prisma.contact.delete({
      where: {
        id: contactId,
      },
    });
    
    revalidatePath('/contacts');
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw new Error('Failed to delete contact');
  }
}
