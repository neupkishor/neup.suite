'use client';
import {
  doc,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export async function deleteProject(
  db: Firestore,
  projectId: string
) {
  const projectDoc = doc(db, 'projects', projectId);
  
  return deleteDoc(projectDoc).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: projectDoc.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
