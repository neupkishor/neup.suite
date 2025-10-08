
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference, query, where } from "firebase/firestore";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone } from "lucide-react";
import { AddItemCard } from "@/components/add-item-card";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";

type Feedback = {
    id: string;
    title: string;
    submittedBy: string;
};

function FeedbackCard({ feedback }: { feedback: Feedback }) {
    return (
        <Card>
            <CardContent className="p-4">
                <Link href={`/feedback/${feedback.id}`} className="font-semibold text-lg hover:underline">{feedback.title}</Link>
                <p className="text-sm text-muted-foreground">Submitted by: {feedback.submittedBy}</p>
            </CardContent>
        </Card>
    )
}

export default function FeedbackPage() {
    const firestore = useFirestore();
    const [clientId, setClientId] = useState<string|null>(null);

    useEffect(() => {
        setClientId(Cookies.get('client') || null);
    }, []);

    const feedbackCollection = useMemo(() => {
        if (!firestore || !clientId) return null;
        return query(
            collection(firestore, 'feedback') as CollectionReference<Feedback>,
            where('clientId', '==', clientId)
        );
    }, [firestore, clientId]);

    const { data: feedbackItems, loading } = useCollection<Feedback>(feedbackCollection);

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Client Feedback</CardTitle>
                <CardDescription>
                Review comments and feedback from clients.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
       {!clientId ? (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">Please select a client to manage their feedback.</p>
                    <Button asChild><Link href="/clients">Select Client</Link></Button>
                </CardContent>
            </Card>
        ) : (
      <div className="grid grid-cols-1 gap-4">
        {!loading && (
            <AddItemCard
                title="New Feedback"
                href="/feedback/add"
                icon={Megaphone}
            />
        )}
        {loading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        {feedbackItems?.map(item => <FeedbackCard key={item.id} feedback={item} />)}
          {!loading && feedbackItems?.length === 0 && (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No feedback found for this client.
                </CardContent>
            </Card>
        )}
      </div>
      )}
    </div>
  );
}
