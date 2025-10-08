
'use client';
import {
  doc,
  updateDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { reportSchema } from '@/schemas/report';
import { z } from 'zod';

type UpdatedReport = z.infer<typeof reportSchema>;

export async function updateReport(
  db: Firestore,
  reportId: string,
  reportData: UpdatedReport
) {
  const reportDoc = doc(db, 'reports', reportId);
  
  return updateDoc(reportDoc, {
    ...reportData,
  }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: reportDoc.path,
      operation: 'update',
      requestResourceData: reportData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
