
'use client';
import { use, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityForm } from '@/app/(app)/activities/components/activity-form';
import { useDoc, useCollection } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { doc, DocumentReference, collection, CollectionReference, query, where } from 'firebase/firestore';
import type { Activity } from '@/schemas/activity';
import { Skeleton } from '@/components/ui/skeleton';

type Project = {
    id: string;
    name: string;
};

export default function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const firestore = useFirestore();

    const activityRef = useMemo(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'activities', id) as DocumentReference<Activity>;
    }, [firestore, id]);

    const { data: activity, loading: activityLoading } = useDoc<Activity>(activityRef);

    const projectsCollection = useMemo(() => {
        if (!firestore || !activity?.clientId) return null;
        return query(
            collection(firestore, 'projects') as CollectionReference<Project>,
            where('clientId', '==', activity.clientId)
        );
    }, [firestore, activity?.clientId]);

    const { data: projects, loading: projectsLoading } = useCollection<Project>(projectsCollection);

    const loading = activityLoading || projectsLoading;

    if (loading || !activity) {
        return <Card>
            <CardHeader><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64 mt-2" /></CardHeader>
            <CardContent><Skeleton className="h-96" /></CardContent>
        </Card>
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Edit Activity</CardTitle>
        <CardDescription>
          Update the details for this activity log.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ActivityForm activity={activity} clientId={activity.clientId} projects={projects || []} />
      </CardContent>
    </Card>
  );
}

    