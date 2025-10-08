'use client';
import {
  collection,
  addDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { z } from 'zod';
import { invoiceSchema } from '@/schemas/invoice';

type NewInvoice = Omit<z.infer<typeof invoiceSchema>, 'dueDate'> & {
    dueDate: string;
};

export async function addInvoice(
  db: Firestore,
  invoiceData: NewInvoice
) {
  const invoicesCollection = collection(db, 'invoices');
  
  return addDoc(invoicesCollection, {
    ...invoiceData,
    createdOn: serverTimestamp(),
    updatedOn: serverTimestamp(),
  }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: invoicesCollection.path,
      operation: 'create',
      requestResourceData: invoiceData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
