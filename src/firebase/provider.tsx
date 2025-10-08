'use client';
import { createContext, useContext, ReactNode } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseContextType {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  firebaseApp: null,
  firestore: null,
});

export const FirebaseProvider = ({
  children,
  firebaseApp,
  firestore,
}: {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
}) => {
  return (
    <FirebaseContext.Provider
      value={{
        firebaseApp,
        firestore,
      }}
    >
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseApp = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.firebaseApp;
};

export const useFirestore = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return context.firestore;
};
