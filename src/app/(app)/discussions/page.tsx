
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-react";

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

    const discussionsCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'discussions') as CollectionReference<Discussion>;
    }, [firestore]);

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
            <Button asChild>
                <Link href="/discussions/add"><MessageCircle className="mr-2 h-4 w-4"/>New Discussion</Link>
            </Button>
        </div>
      </CardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        {discussions?.map(item => <DiscussionCard key={item.id} discussion={item} />)}
      </div>
      {!loading && discussions?.length === 0 && (
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                No discussions found.
            </CardContent>
        </Card>
      )}
    </div>
  );
}
