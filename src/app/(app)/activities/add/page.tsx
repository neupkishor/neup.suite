
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityForm } from '../components/activity-form';
import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference, query, where } from "firebase/firestore";
import { useCollection } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";

type Project = {
    id: string;
    name: string;
};

export default function AddActivityPage() {
    const firestore = useFirestore();
    const [clientId, setClientId] = useState<string|null>(null);

    useEffect(() => {
        setClientId(Cookies.get('client') || null);
    }, []);

    const projectsCollection = useMemo(() => {
        if (!firestore || !clientId) return null;
        return query(
            collection(firestore, 'projects') as CollectionReference<Project>,
            where('clientId', '==', clientId)
        );
    }, [firestore, clientId]);
    
    const { data: projects, loading: projectsLoading } = useCollection<Project>(projectsCollection);


    if (projectsLoading) {
        return <Card>
            <CardHeader><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64 mt-2" /></CardHeader>
            <CardContent><Skeleton className="h-96" /></CardContent>
        </Card>
    }

    if (!clientId) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Client Not Selected</CardTitle>
                    <CardDescription>Please select a client before adding a new activity.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/clients">Select a Client</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Log a New Activity</CardTitle>
        <CardDescription>
          Record what you did, the results, and attach any relevant files or links.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ActivityForm clientId={clientId} projects={projects || []} />
      </CardContent>
    </Card>
  );
}

    