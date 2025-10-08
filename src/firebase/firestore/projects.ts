'use client';
import {
  collection,
  addDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type NewProject = {
    identifier: string;
    name: string;
    status: string;
    deadline: string;
}

export async function createProject(
  db: Firestore,
  projectData: NewProject
) {
  const projectsCollection = collection(db, 'projects');
  
  try {
    await addDoc(projectsCollection, {
      ...projectData,
      createdBy: 'user_placeholder', // Will be replaced with auth user ID
      createdOn: serverTimestamp(),
    });
  } catch(serverError) {
    const permissionError = new FirestorePermissionError({
      path: projectsCollection.path,
      operation: 'create',
      requestResourceData: projectData,
    });
    errorEmitter.emit('permission-error', permissionError);
    // Re-throw the error so the form knows there was a problem
    throw serverError;
  }
}
