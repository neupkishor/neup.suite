'use server';

import { prisma } from '@/lib/prisma';
import type { Contact } from '@/schemas/contact';
import { revalidatePath } from 'next/cache';

export async function addContact(contactData: Contact) {
  try {
    const newContact = await prisma.contact.create({
      data: {
        firstName: contactData.name.firstName,
        lastName: contactData.name.lastName,
        middleName: contactData.name.middleName,
        role: contactData.role,
        organization: contactData.organization,
        notes: contactData.notes,
        avatarUrl: contactData.avatarUrl,
        clientId: contactData.clientId,
        // Store complex objects as JSON
        emails: contactData.emails ? JSON.parse(JSON.stringify(contactData.emails)) : undefined,
        phoneNumbers: contactData.phoneNumbers ? JSON.parse(JSON.stringify(contactData.phoneNumbers)) : undefined,
        addresses: contactData.addresses ? JSON.parse(JSON.stringify(contactData.addresses)) : undefined,
        socialProfiles: contactData.socialProfiles ? JSON.parse(JSON.stringify(contactData.socialProfiles)) : undefined,
        messaging: contactData.messaging ? JSON.parse(JSON.stringify(contactData.messaging)) : undefined,
        importantDates: contactData.importantDates ? JSON.parse(JSON.stringify(contactData.importantDates)) : undefined,
      },
    });
    
    revalidatePath('/contacts');
    return newContact;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw new Error('Failed to create contact');
  }
}
