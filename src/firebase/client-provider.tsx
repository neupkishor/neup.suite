
'use client';

import React, { ReactNode, useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';


export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const { firebaseApp, firestore } = useMemo(
    () => initializeFirebase(),
    []
  );

  if (!firebaseApp || !firestore) {
    return <>{children}</>;
  }

  return (
    <FirebaseProvider firebaseApp={firebaseApp} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
