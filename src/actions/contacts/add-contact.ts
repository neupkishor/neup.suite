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
import { contactSchema } from '@/schemas/contact';

type NewContact = z.infer<typeof contactSchema>;

export async function addContact(
  db: Firestore,
  contactData: NewContact
) {
  const contactsCollection = collection(db, 'contacts');
  
  return addDoc(contactsCollection, {
    ...contactData,
    createdOn: serverTimestamp(),
    updatedOn: serverTimestamp(),
  }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: contactsCollection.path,
      operation: 'create',
      requestResourceData: contactData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
