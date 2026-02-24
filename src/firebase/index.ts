
'use client';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Re-export providers and hooks
export { FirebaseProvider, useFirebaseApp, useFirestore, useAuth } from '@/firebase/provider';
export { FirebaseClientProvider } from '@/firebase/client-provider';
export { useCollection } from '@/firebase/firestore/use-collection';
export { useDoc } from '@/firebase/firestore/use-doc';

let app: FirebaseApp;
let db: Firestore;

export function initializeFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    app = getApp();
    db = getFirestore(app);
  }
  return { firebaseApp: app, firestore: db };
}
