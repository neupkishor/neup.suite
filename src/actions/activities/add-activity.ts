
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
import { activitySchema } from '@/schemas/activity';

type NewActivity = z.infer<typeof activitySchema> & { createdBy: string };

export async function addActivity(
  db: Firestore,
  activityData: NewActivity
) {
  const activitiesCollection = collection(db, 'activities');
  
  return addDoc(activitiesCollection, {
    ...activityData,
    createdOn: serverTimestamp(),
    updatedOn: serverTimestamp(),
  }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: activitiesCollection.path,
      operation: 'create',
      requestResourceData: activityData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
