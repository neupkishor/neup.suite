
'use client';
import {
  collection,
  addDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { goalSchema } from '@/schemas/goal';
import { z } from 'zod';

type NewGoal = z.infer<typeof goalSchema>;

export async function addGoal(
  db: Firestore,
  goalData: Omit<NewGoal, 'targetDate'> & { targetDate: string }
) {
  const goalsCollection = collection(db, 'goals');
  
  return addDoc(goalsCollection, {
    ...goalData,
    createdOn: serverTimestamp(),
    updatedOn: serverTimestamp(),
  }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: goalsCollection.path,
      operation: 'create',
      requestResourceData: goalData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
