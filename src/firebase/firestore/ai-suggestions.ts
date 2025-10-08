'use client';
import { doc, setDoc, Firestore, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { SuggestActionsOutput } from '@/ai/flows/ai-suggested-actions';

export function saveAiSuggestion(
  db: Firestore,
  docId: string,
  data: SuggestActionsOutput
) {
  const docRef = doc(db, 'ai_suggestions', docId);

  setDoc(docRef, { ...data, createdAt: serverTimestamp() }, { merge: true }).catch(
    async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
    }
  );
}
