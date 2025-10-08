
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DiscussionForm } from '../components/discussion-form';
import { useDoc } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { doc, DocumentReference } from "firebase/firestore";
import { useMemo, use } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Discussion = {
    id: string;
    title: string;
};


export default function EditDiscussionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const firestore = useFirestore();
    const discussionRef = useMemo(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'discussions', id) as DocumentReference<Discussion>;
    }, [firestore, id]);

    const { data: discussion, loading } = useDoc<Discussion>(discussionRef);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Edit Discussion</CardTitle>
        <CardDescription>
          Update the title of this discussion.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <Skeleton className="h-40" />}
        {discussion && <DiscussionForm discussion={discussion} />}
      </CardContent>
    </Card>
  );
}
