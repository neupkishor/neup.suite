
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
import { projectSchema } from '@/schemas/project';


type NewProject = Omit<z.infer<typeof projectSchema>, 'deadline'> & {
    deadline: string;
};

export async function createProject(
  db: Firestore,
  projectData: NewProject,
  userId: string
) {
  const projectsCollection = collection(db, 'projects');
  
  return addDoc(projectsCollection, {
    ...projectData,
    createdBy: userId,
    createdOn: serverTimestamp(),
  }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: projectsCollection.path,
      operation: 'create',
      requestResourceData: projectData,
    });
    errorEmitter.emit('permission-error', permissionError);
    // Re-throw the error so the calling component knows there was a problem
    throw serverError;
  });
}
