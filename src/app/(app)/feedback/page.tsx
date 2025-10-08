
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone } from "lucide-react";

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
            <Button asChild>
                <Link href="/feedback/add"><Megaphone className="mr-2 h-4 w-4"/>New Feedback</Link>
            </Button>
        </div>
      </CardHeader>
      <div className="space-y-4">
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
