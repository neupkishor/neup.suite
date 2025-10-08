'use client';
import {
  doc,
  updateDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { z } from 'zod';
import { invoiceSchema } from '@/schemas/invoice';

type UpdatedInvoice = Omit<z.infer<typeof invoiceSchema>, 'dueDate'> & {
    dueDate: string;
};

export async function updateInvoice(
  db: Firestore,
  invoiceId: string,
  invoiceData: UpdatedInvoice
) {
  const invoiceDoc = doc(db, 'invoices', invoiceId);
  
  return updateDoc(invoiceDoc, {
    ...invoiceData,
    updatedOn: serverTimestamp(),
  }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: invoiceDoc.path,
      operation: 'update',
      requestResourceData: invoiceData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
