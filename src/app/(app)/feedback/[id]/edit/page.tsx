
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackForm } from '../components/feedback-form';
import { useDoc } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { doc, DocumentReference } from "firebase/firestore";
import { useMemo, use } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Feedback = {
    id: string;
    title: string;
    comment: string;
};


export default function EditFeedbackPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const firestore = useFirestore();
    const feedbackRef = useMemo(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'feedback', id) as DocumentReference<Feedback>;
    }, [firestore, id]);

    const { data: feedback, loading } = useDoc<Feedback>(feedbackRef);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Edit Feedback</CardTitle>
        <CardDescription>
          Update your feedback or comment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <Skeleton className="h-64" />}
        {feedback && <FeedbackForm feedback={feedback} />}
      </CardContent>
    </Card>
  );
}
