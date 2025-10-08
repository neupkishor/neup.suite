
'use client';
import {
  doc,
  updateDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { feedbackSchema } from '@/schemas/feedback';
import { z } from 'zod';

type UpdatedFeedback = z.infer<typeof feedbackSchema>;

export async function updateFeedback(
  db: Firestore,
  feedbackId: string,
  feedbackData: UpdatedFeedback
) {
  const feedbackDoc = doc(db, 'feedback', feedbackId);
  
  return updateDoc(feedbackDoc, {
    ...feedbackData,
  }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: feedbackDoc.path,
      operation: 'update',
      requestResourceData: feedbackData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
