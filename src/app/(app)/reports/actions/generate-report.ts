
'use client';
import {
  collection,
  addDoc,
  serverTimestamp,
  Firestore,
  getDocs,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Activity } from '@/schemas/activity';
import { format } from 'date-fns';

type GenerateReportOptions = {
  clientId: string;
  type: 'client' | 'project';
  dateRange: { from: Date; to: Date };
  projectId?: string;
};

const fetchActivities = async (db: Firestore, options: GenerateReportOptions): Promise<Activity[]> => {
    let activityQuery = query(
        collection(db, 'activities'),
        where('clientId', '==', options.clientId),
        where('createdOn', '>=', Timestamp.fromDate(options.dateRange.from)),
        where('createdOn', '<=', Timestamp.fromDate(options.dateRange.to))
    );

    if (options.type === 'project' && options.projectId) {
        activityQuery = query(activityQuery, where('projectId', '==', options.projectId));
    }

    const snapshot = await getDocs(activityQuery);
    return snapshot.docs.map(doc => doc.data() as Activity);
}

const createReportSummary = (activities: Activity[]): string => {
    if (activities.length === 0) {
        return "No activities found for the selected period.";
    }

    let summary = `This report covers ${activities.length} activities.\n\n`;
    summary += "Highlights:\n";
    activities.forEach(activity => {
        summary += `- ${activity.title}\n`;
        if (activity.results) {
            summary += `  - Results: ${activity.results}\n`;
        }
    });

    return summary;
}


export async function generateReport(
  db: Firestore,
  options: GenerateReportOptions
) {
  const reportsCollection = collection(db, 'reports');

  try {
    const activities = await fetchActivities(db, options);
    const summary = createReportSummary(activities);

    const { clientId, type, dateRange, projectId } = options;
    const from = format(dateRange.from, 'MMM d, yyyy');
    const to = format(dateRange.to, 'MMM d, yyyy');
    
    let title = `Client Report: ${from} - ${to}`;
    if (type === 'project' && projectId) {
        // In a real app, we'd fetch the project name
        title = `Project Report (${projectId}): ${from} - ${to}`;
    }

    const reportData = {
        title,
        summary,
        clientId,
        type,
        dateRange: { from: Timestamp.fromDate(dateRange.from), to: Timestamp.fromDate(dateRange.to) },
        projectId: projectId || null,
        generatedOn: serverTimestamp(),
    };
  
    return addDoc(reportsCollection, reportData).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
        path: reportsCollection.path,
        operation: 'create',
        requestResourceData: reportData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    });

  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
}
