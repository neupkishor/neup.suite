
'use client';
import {
  doc,
  updateDoc,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { discussionSchema } from '@/schemas/discussion';
import { z } from 'zod';

type UpdatedDiscussion = z.infer<typeof discussionSchema>;

export async function updateDiscussion(
  db: Firestore,
  discussionId: string,
  discussionData: UpdatedDiscussion
) {
  const discussionDoc = doc(db, 'discussions', discussionId);
  
  return updateDoc(discussionDoc, {
    ...discussionData,
  }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: discussionDoc.path,
      operation: 'update',
      requestResourceData: discussionData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
