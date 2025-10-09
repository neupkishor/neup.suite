
'use client';

import { collection, addDoc, serverTimestamp, Firestore, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Report } from '@/schemas/report';

type ReportData = Omit<Report, 'id' | 'generatedOn'>;

export async function generateAndSaveReport(db: Firestore, reportData: ReportData) {
  const reportsCollection = collection(db, 'reports');
  
  const dataToSave = {
    ...reportData,
    generatedOn: serverTimestamp(),
  };

  try {
    const docRef = await addDoc(reportsCollection, dataToSave);
    return docRef.id;
  } catch (serverError) {
    const permissionError = new FirestorePermissionError({
      path: reportsCollection.path,
      operation: 'create',
      requestResourceData: dataToSave,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  }
}
