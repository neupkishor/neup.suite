
'use client';
import {
  doc,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export async function deleteDiscussion(
  db: Firestore,
  discussionId: string
) {
  const discussionDoc = doc(db, 'discussions', discussionId);
  
  return deleteDoc(discussionDoc).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: discussionDoc.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
