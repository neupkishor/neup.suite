'use client';

import React, { ReactNode, useMemo } from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const { firebaseApp, firestore } = useMemo(
    () => initializeFirebase(),
    []
  );

  return (
    <FirebaseProvider firebaseApp={firebaseApp} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}