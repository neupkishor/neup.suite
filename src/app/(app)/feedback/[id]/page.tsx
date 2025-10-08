
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useDoc } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { doc, DocumentReference } from "firebase/firestore";
import { useMemo, use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteFeedback } from '../actions/delete-feedback';
import { useRouter } from "next/navigation";

type Feedback = {
    id: string;
    title: string;
    comment: string;
    submittedBy: string;
    submittedOn: string;
};

export default function FeedbackDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const firestore = useFirestore();
    const router = useRouter();

    const feedbackRef = useMemo(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'feedback', id) as DocumentReference<Feedback>;
    }, [firestore, id]);

    const { data: feedback, loading } = useDoc<Feedback>(feedbackRef);

    const handleDelete = async () => {
        if (!firestore || !id) return;
        if (confirm('Are you sure you want to delete this feedback?')) {
            await deleteFeedback(firestore, id);
            router.push('/feedback');
        }
    }

  if (loading) {
    return <Card>
        <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
        </CardContent>
    </Card>
  }

  if (!feedback) {
    return <Card><CardHeader><CardTitle>Feedback not found</CardTitle></CardHeader></Card>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-2xl">{feedback.title}</CardTitle>
                <CardDescription>
                    Submitted by: {feedback.submittedBy} on {new Date(feedback.submittedOn).toLocaleString()}
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button asChild>
                    <Link href={`/feedback/${id}/edit`}>Edit</Link>
                </Button>
                 <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{feedback.comment}</p>
      </CardContent>
    </Card>
  );
}
