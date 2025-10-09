
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference, query, where, orderBy } from "firebase/firestore";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";
import { AddItemCard } from "@/components/add-item-card";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import type { Activity as ActivityType } from "@/schemas/activity";
import { format } from "date-fns";

function ActivityCard({ activity }: { activity: ActivityType & { createdOn: { seconds: number } } }) {
    const createdDate = activity.createdOn
        ? format(new Date(activity.createdOn.seconds * 1000), 'PPP')
        : 'No date';

    return (
        <Card>
            <CardContent className="p-4">
                <Link href={`/activities/${activity.id}`} className="block hover:bg-muted/50 rounded-md -m-2 p-2">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold text-lg ">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{createdDate}</p>
                    </div>
                    {activity.description && <p className="text-sm text-muted-foreground truncate mt-1">{activity.description}</p>}
                </Link>
            </CardContent>
        </Card>
    )
}

export default function ActivitiesPage() {
    const firestore = useFirestore();
    const [clientId, setClientId] = useState<string|null>(null);

    useEffect(() => {
        setClientId(Cookies.get('client') || null);
    }, []);

    const activitiesCollection = useMemo(() => {
        if (!firestore || !clientId) return null;
        return query(
            collection(firestore, 'activities') as CollectionReference<ActivityType>,
            where('clientId', '==', clientId),
            orderBy('createdOn', 'desc')
        );
    }, [firestore, clientId]);

    const { data: activities, loading } = useCollection<ActivityType & { createdOn: { seconds: number } }>(activitiesCollection);

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Activities</CardTitle>
                <CardDescription>
                A log of all work, updates, and results for this client.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
       {!clientId ? (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">Please select a client to manage their activities.</p>
                    <Button asChild><Link href="/clients">Select Client</Link></Button>
                </CardContent>
            </Card>
        ) : (
      <div className="grid grid-cols-1 gap-4">
        {!loading && (
            <AddItemCard
                title="New Activity"
                href="/activities/add"
                icon={Activity}
            />
        )}
        {loading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        {activities?.map(item => <ActivityCard key={item.id} activity={item} />)}
          {!loading && activities?.length === 0 && (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No activities found for this client.
                </CardContent>
            </Card>
        )}
      </div>
      )}
    </div>
  );
}

    