
'use client';
import {
  collection,
  addDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { discussionSchema } from '@/schemas/discussion';
import { z } from 'zod';

type NewDiscussion = z.infer<typeof discussionSchema> & { createdBy: string };

export async function addDiscussion(
  db: Firestore,
  discussionData: NewDiscussion
) {
  const discussionsCollection = collection(db, 'discussions');
  
  return addDoc(discussionsCollection, {
    ...discussionData,
    createdOn: serverTimestamp(),
  }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: discussionsCollection.path,
      operation: 'create',
      requestResourceData: discussionData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
