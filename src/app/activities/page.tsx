
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore } from "@/firebase/provider";
import { collection, query, where, orderBy, limit, getDocs, startAfter, endBefore, limitToLast, DocumentSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, ArrowLeft, ArrowRight } from "lucide-react";
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

const ACTIVITIES_PER_PAGE = 10;

export default function ActivitiesPage() {
    const firestore = useFirestore();
    const [clientId, setClientId] = useState<string|null>(null);
    const [activities, setActivities] = useState<(ActivityType & { createdOn: { seconds: number } })[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
    const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | null>(null);
    const [isFirstPage, setIsFirstPage] = useState(true);
    const [isLastPage, setIsLastPage] = useState(false);


    useEffect(() => {
        setClientId(Cookies.get('client') || null);
    }, []);

    const fetchActivities = async (direction: 'next' | 'prev' | 'initial' = 'initial') => {
        if (!firestore || !clientId) {
            setLoading(false);
            return;
        }
        
        setLoading(true);

        try {
            const activitiesCollection = collection(firestore, 'activities');
            let q;

            if (direction === 'next' && lastDoc) {
                 q = query(
                    activitiesCollection,
                    where('clientId', '==', clientId),
                    orderBy('createdOn', 'desc'),
                    startAfter(lastDoc),
                    limit(ACTIVITIES_PER_PAGE)
                );
            } else if (direction === 'prev' && firstDoc) {
                 q = query(
                    activitiesCollection,
                    where('clientId', '==', clientId),
                    orderBy('createdOn', 'desc'),
                    endBefore(firstDoc),
                    limitToLast(ACTIVITIES_PER_PAGE)
                );
            } else {
                 q = query(
                    activitiesCollection,
                    where('clientId', '==', clientId),
                    orderBy('createdOn', 'desc'),
                    limit(ACTIVITIES_PER_PAGE)
                );
            }

            const documentSnapshots = await getDocs(q);
            const fetchedActivities = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityType & { createdOn: { seconds: number } }));
            
            if (fetchedActivities.length > 0) {
              setActivities(fetchedActivities);
            }

            const newFirstDoc = documentSnapshots.docs[0];
            const newLastDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];
            setFirstDoc(newFirstDoc || null);
            setLastDoc(newLastDoc || null);
            
            // Check for previous page
            const firstVisible = documentSnapshots.docs[0];
            if (firstVisible) {
                const prevQuery = query(activitiesCollection, where('clientId', '==', clientId), orderBy('createdOn', 'desc'), endBefore(firstVisible), limitToLast(1));
                const prevSnap = await getDocs(prevQuery);
                setIsFirstPage(prevSnap.empty);
            } else {
                // If there are no docs, it could be we're at an edge.
                // Re-evaluating isFirstPage when going back.
                if (direction !== 'prev') {
                  setIsFirstPage(true);
                }
            }
            
            // Check for next page
            const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
            if (lastVisible) {
              const nextQuery = query(activitiesCollection, where('clientId', '==', clientId), orderBy('createdOn', 'desc'), startAfter(lastVisible), limit(1));
              const nextSnap = await getDocs(nextQuery);
              setIsLastPage(nextSnap.empty);
            } else {
               if (direction !== 'next') {
                 setIsLastPage(true);
               }
            }


        } catch (error) {
            console.error("Error fetching activities:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(clientId) {
            fetchActivities('initial');
        } else {
            setActivities([]);
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientId, firestore]);

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
        <>
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
            <div className="flex justify-end gap-2">
                <Button onClick={() => fetchActivities('prev')} disabled={loading || isFirstPage} variant="outline"><ArrowLeft/> Previous</Button>
                <Button onClick={() => fetchActivities('next')} disabled={loading || isLastPage} variant="outline">Next <ArrowRight/></Button>
            </div>
        </>
      )}
    </div>
  );
}
