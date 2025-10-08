
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useDoc } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { doc, DocumentReference } from "firebase/firestore";
import { useMemo, use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteDiscussion } from '../actions/delete-discussion';
import { useRouter } from "next/navigation";

type Discussion = {
    id: string;
    title: string;
    createdBy: string;
    createdOn: string;
};

export default function DiscussionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const firestore = useFirestore();
    const router = useRouter();

    const discussionRef = useMemo(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'discussions', id) as DocumentReference<Discussion>;
    }, [firestore, id]);

    const { data: discussion, loading } = useDoc<Discussion>(discussionRef);

    const handleDelete = async () => {
        if (!firestore || !id) return;
        if (confirm('Are you sure you want to delete this discussion?')) {
            await deleteDiscussion(firestore, id);
            router.push('/discussions');
        }
    }

  if (loading) {
    return <Card>
        <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
        </CardContent>
    </Card>
  }

  if (!discussion) {
    return <Card><CardHeader><CardTitle>Discussion not found</CardTitle></CardHeader></Card>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-2xl">{discussion.title}</CardTitle>
                <CardDescription>
                    Started by: {discussion.createdBy} on {new Date(discussion.createdOn).toLocaleString()}
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button asChild>
                    <Link href={`/discussions/${id}/edit`}>Edit</Link>
                </Button>
                 <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>Discussion content will go here.</p>
      </CardContent>
    </Card>
  );
}
