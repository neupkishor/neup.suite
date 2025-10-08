import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { FirebaseProvider, useFirebaseApp, useFirestore } from './provider';
import { FirebaseClientProvider } from './client-provider';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';

function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
} {
  try {
    const firebaseApp = getApp();
    const firestore = getFirestore(firebaseApp);
    return { firebaseApp, firestore };
  } catch {
    const firebaseApp = initializeApp(firebaseConfig);
    const firestore = getFirestore(firebaseApp);
    return { firebaseApp, firestore };
  }
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useCollection,
  useDoc,
  useFirebaseApp,
  useFirestore,
};
