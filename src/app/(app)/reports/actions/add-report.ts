
'use client';
import {
  collection,
  addDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { reportSchema } from '@/schemas/report';
import { z } from 'zod';

type NewReport = z.infer<typeof reportSchema>;

export async function addReport(
  db: Firestore,
  reportData: NewReport
) {
  const reportsCollection = collection(db, 'reports');
  
  return addDoc(reportsCollection, {
    ...reportData,
    generatedOn: serverTimestamp(),
  }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: reportsCollection.path,
      operation: 'create',
      requestResourceData: reportData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
