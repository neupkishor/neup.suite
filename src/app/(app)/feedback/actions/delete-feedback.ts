
'use client';
import {
  doc,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export async function deleteFeedback(
  db: Firestore,
  feedbackId: string
) {
  const feedbackDoc = doc(db, 'feedback', feedbackId);
  
  return deleteDoc(feedbackDoc).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: feedbackDoc.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
