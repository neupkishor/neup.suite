
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone } from "lucide-react";
import { AddItemCard } from "@/components/add-item-card";

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

    const feedbackCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'feedback') as CollectionReference<Feedback>;
    }, [firestore]);

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
      </div>
      {!loading && feedbackItems?.length === 0 && (
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                No feedback found.
            </CardContent>
        </Card>
      )}
    </div>
  );
}
