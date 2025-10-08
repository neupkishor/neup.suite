
'use client';
import {
  doc,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export async function deleteReport(
  db: Firestore,
  reportId: string
) {
  const reportDoc = doc(db, 'reports', reportId);
  
  return deleteDoc(reportDoc).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: reportDoc.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
