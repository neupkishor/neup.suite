
'use client';
import {
  doc,
  updateDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { z } from 'zod';
import { activitySchema } from '@/schemas/activity';

type UpdatedActivity = z.infer<typeof activitySchema>;

export async function updateActivity(
  db: Firestore,
  activityId: string,
  activityData: UpdatedActivity
) {
  const activityDoc = doc(db, 'activities', activityId);
  
  return updateDoc(activityDoc, {
    ...activityData,
    updatedOn: serverTimestamp(),
  }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: activityDoc.path,
      operation: 'update',
      requestResourceData: activityData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
