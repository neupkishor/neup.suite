
'use client';
import Emitter from 'tiny-emitter';
import { addDoc, collection, Firestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

let db: Firestore | null = null;
const getDb = () => {
  if (!db) {
    try {
      db = initializeFirebase().firestore;
    } catch (e) {
      console.error("Failed to initialize Firestore for error logging", e);
    }
  }
  return db;
};


export interface AppError {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  context?: Record<string, any>;
}

class ErrorLogger {
  private errors: AppError[] = [];
  private emitter = new (Emitter as any)();

  public async log(error: Error, context?: Record<string, any>) {
    console.error("Error Logged:", error);
    const newError: AppError = {
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      message: error.message,
      stack: error.stack,
      timestamp: new Date(),
      context,
    };
    this.errors.unshift(newError); // Add to the beginning of the array
    this.emitter.emit('update', this.getErrors());

    const firestoreDb = getDb();
    if (firestoreDb) {
        try {
          const errorsCollection = collection(firestoreDb, 'errors');
          await addDoc(errorsCollection, {
              message: newError.message,
              stack: newError.stack,
              timestamp: newError.timestamp,
              context: newError.context,
              userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
              url: typeof window !== 'undefined' ? window.location.href : '',
          });
        } catch (firestoreError) {
          console.error('Failed to log error to Firestore:', firestoreError);
        }
    }
  }

  public getErrors(): AppError[] {
    return [...this.errors];
  }

  public subscribe(callback: (errors: AppError[]) => void): () => void {
    const handler = (errors: AppError[]) => callback(errors);
    this.emitter.on('update', handler);
    return () => this.emitter.off('update', handler);
  }
}

// Singleton instance
export const errorLogger = new ErrorLogger();
