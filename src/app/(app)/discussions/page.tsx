
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference, query, where } from "firebase/firestore";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-react";
import { AddItemCard } from "@/components/add-item-card";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";

type Discussion = {
    id: string;
    title: string;
    createdBy: string;
};

function DiscussionCard({ discussion }: { discussion: Discussion }) {
    return (
        <Card>
            <CardContent className="p-4">
                <Link href={`/discussions/${discussion.id}`} className="font-semibold text-lg hover:underline">{discussion.title}</Link>
                <p className="text-sm text-muted-foreground">Started by: {discussion.createdBy}</p>
            </CardContent>
        </Card>
    )
}

export default function DiscussionsPage() {
    const firestore = useFirestore();
    const [clientId, setClientId] = useState<string|null>(null);

    useEffect(() => {
        setClientId(Cookies.get('client') || null);
    }, []);

    const discussionsCollection = useMemo(() => {
        if (!firestore || !clientId) return null;
        return query(
            collection(firestore, 'discussions') as CollectionReference<Discussion>,
            where('clientId', '==', clientId)
        );
    }, [firestore, clientId]);

    const { data: discussions, loading } = useCollection<Discussion>(discussionsCollection);

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Discussions</CardTitle>
                <CardDescription>
                Start and participate in discussion threads.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
       {!clientId ? (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">Please select a client to manage their discussions.</p>
                    <Button asChild><Link href="/clients">Select Client</Link></Button>
                </CardContent>
            </Card>
        ) : (
      <div className="grid grid-cols-1 gap-4">
        {!loading && (
            <AddItemCard
                title="New Discussion"
                href="/discussions/add"
                icon={MessageCircle}
            />
        )}
        {loading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        {discussions?.map(item => <DiscussionCard key={item.id} discussion={item} />)}
          {!loading && discussions?.length === 0 && (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No discussions found for this client.
                </CardContent>
            </Card>
          )}
      </div>
      )}
    </div>
  );
}
