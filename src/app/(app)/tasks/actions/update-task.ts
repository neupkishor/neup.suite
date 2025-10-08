
'use client';
import {
  doc,
  updateDoc,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { z } from 'zod';
import { taskSchema } from '@/schemas/task';

type UpdatedTask = Partial<Omit<z.infer<typeof taskSchema>, 'deadline'> & { deadline: string | null }>;

export async function updateTask(
  db: Firestore,
  taskId: string,
  taskData: UpdatedTask
) {
  const taskDoc = doc(db, 'tasks', taskId);
  
  return updateDoc(taskDoc, taskData).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: taskDoc.path,
      operation: 'update',
      requestResourceData: taskData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
