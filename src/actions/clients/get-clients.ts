'use server';

import { prisma } from '@/lib/prisma';
import { Client } from '@/generated/prisma'; // Or where the type is defined, usually just Prisma Client
// Actually usually import { Client } from '@prisma/client';

export async function getClients() {
  try {
    // In a real app, we would filter by the logged-in user's organization or ID
    // const userId = ...
    // where: { owner_id: userId }
    const clients = await prisma.client.findMany({
      orderBy: {
        created_on: 'desc',
      },
    });
    return { success: true, clients };
  } catch (error) {
    console.error('Failed to get clients:', error);
    return { success: false, error: 'Failed to get clients' };
  }
}

export async function getClient(id: string) {
  try {
    const client = await prisma.client.findUnique({
      where: { id },
    });
    
    if (!client) {
        return { success: false, error: 'Client not found' };
    }
    
    return { success: true, client };
  } catch (error) {
    console.error('Failed to get client:', error);
    return { success: false, error: 'Failed to get client' };
  }
}
