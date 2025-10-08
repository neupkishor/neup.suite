
'use client';
import {
  collection,
  addDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { feedbackSchema } from '@/schemas/feedback';
import { z } from 'zod';

type NewFeedback = z.infer<typeof feedbackSchema> & { submittedBy: string };

export async function addFeedback(
  db: Firestore,
  feedbackData: NewFeedback
) {
  const feedbackCollection = collection(db, 'feedback');
  
  return addDoc(feedbackCollection, {
    ...feedbackData,
    submittedOn: serverTimestamp(),
  }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: feedbackCollection.path,
      operation: 'create',
      requestResourceData: feedbackData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
