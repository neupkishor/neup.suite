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

export function createProject(
  db: Firestore,
  projectData: NewProject
) {
  const projectsCollection = collection(db, 'projects');
  
  // NOTE: We don't await this so it doesn't block.
  // The optimistic update will be handled by the onSnapshot listener.
  addDoc(projectsCollection, {
    ...projectData,
    createdBy: 'user_placeholder', // Will be replaced with auth user ID
    createdOn: serverTimestamp(),
  }).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: projectsCollection.path,
      operation: 'create',
      requestResourceData: projectData,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}
