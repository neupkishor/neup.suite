
'use client';
import {
  doc,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export async function deleteTemplate(
  db: Firestore,
  templateId: string
) {
  const templateDoc = doc(db, 'templates', templateId);
  
  return deleteDoc(templateDoc).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: templateDoc.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}

    