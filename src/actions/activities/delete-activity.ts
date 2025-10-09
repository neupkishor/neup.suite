
'use client';
import {
  doc,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export async function deleteActivity(
  db: Firestore,
  activityId: string
) {
  const activityDoc = doc(db, 'activities', activityId);
  
  return deleteDoc(activityDoc).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: activityDoc.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
