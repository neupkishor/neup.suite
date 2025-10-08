
'use client';
import {
  doc,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export async function deleteGoal(
  db: Firestore,
  goalId: string
) {
  const goalDoc = doc(db, 'goals', goalId);
  
  return deleteDoc(goalDoc).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: goalDoc.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
