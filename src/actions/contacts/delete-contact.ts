'use client';
import {
  doc,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export async function deleteContact(
  db: Firestore,
  contactId: string
) {
  const contactDoc = doc(db, 'contacts', contactId);
  
  return deleteDoc(contactDoc).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: contactDoc.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
