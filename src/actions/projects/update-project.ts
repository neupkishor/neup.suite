'use client';
import {
  doc,
  updateDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { z } from 'zod';
import { projectSchema } from '@/schemas/project';

type UpdatedProject = Omit<z.infer<typeof projectSchema>, 'deadline'> & {
    deadline: string;
};

export async function updateProject(
  db: Firestore,
  projectId: string,
  projectData: Partial<UpdatedProject>
) {
  const projectDoc = doc(db, 'projects', projectId);
  
  return updateDoc(projectDoc, {
    ...projectData,
    updatedOn: serverTimestamp(),
  }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: projectDoc.path,
      operation: 'update',
      requestResourceData: projectData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  });
}
