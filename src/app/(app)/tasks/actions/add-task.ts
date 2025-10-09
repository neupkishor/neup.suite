
'use client';
import {
  collection,
  addDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { z } from 'zod';
import { taskSchema } from '@/schemas/task';

type NewTask = Partial<Omit<z.infer<typeof taskSchema>, 'deadline'> & { deadline: string | null }>;


export async function addTask(
  db: Firestore,
  taskData: NewTask,
  userId: string
) {
  const taskCollection = collection(db, 'tasks');
  
  const dataToSave = {
    ...taskData,
    createdBy: userId,
    createdOn: serverTimestamp(),
  };

  return addDoc(taskCollection, dataToSave).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: taskCollection.path,
      operation: 'create',
      requestResourceData: dataToSave,
    });
    errorEmitter.emit('permission-error', permissionError);
    // Re-throw the error so the calling component knows there was a problem
    throw serverError;
  });
}
