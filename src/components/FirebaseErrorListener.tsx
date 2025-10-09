
// src/components/FirebaseErrorListener.tsx
'use client';
import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorLogger } from '@/lib/error-logger';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
       // Log to our new global logger
      errorLogger.log(error, error.context);

      // For development, we want to see the error in the Next.js overlay
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }
    };
    errorEmitter.on('permission-error', handleError);
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);
  return null;
}
