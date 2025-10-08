
'use client';
import {
  doc,
  updateDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { goalSchema } from '@/schemas/goal';
import { z } from 'zod';

type UpdatedGoal = z.infer<typeof goalSchema>;

export async function updateGoal(
  db: Firestore,
  goalId: string,
  goalData: Omit<UpdatedGoal, 'targetDate'> & { targetDate: string }
) {
  const goalDoc = doc(db, 'goals', goalId);
  
  return updateDoc(goalDoc, {
    ...goalData,
    updatedOn: serverTimestamp(),
  }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: goalDoc.path,
      operation: 'update',
      requestResourceData: goalData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
