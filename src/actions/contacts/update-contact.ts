
'use client';
import {
  doc,
  updateDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Contact } from '@/schemas/contact';

export async function updateContact(
  db: Firestore,
  contactId: string,
  contactData: Contact
) {
  const contactDoc = doc(db, 'contacts', contactId);
  
  return updateDoc(contactDoc, {
    ...contactData,
    updatedOn: serverTimestamp(),
  }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: contactDoc.path,
      operation: 'update',
      requestResourceData: contactData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}

    