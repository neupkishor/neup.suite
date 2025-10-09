
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
import { templateSchema } from '@/schemas/template';

type NewTemplate = Omit<z.infer<typeof templateSchema>, 'data'> & {
  data: any; // Allow object for action
  createdBy: string;
}

export async function addTemplate(
  db: Firestore,
  templateData: NewTemplate
) {
  const templatesCollection = collection(db, 'templates');
  
  return addDoc(templatesCollection, {
    ...templateData,
    createdOn: serverTimestamp(),
  }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: templatesCollection.path,
      operation: 'create',
      requestResourceData: templateData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}

    