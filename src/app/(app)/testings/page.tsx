'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Testing = {
    id: string;
    name: string;
    status: string;
};

function TestingCard({ testing }: { testing: Testing }) {
    return (
        <Card>
            <CardContent className="p-4">
                <Link href={`/testings/${testing.id}`} className="font-semibold text-lg hover:underline">{testing.name}</Link>
                <p className="text-sm text-muted-foreground">{testing.status}</p>
            </CardContent>
        </Card>
    )
}

export default function TestingsPage() {
    const firestore = useFirestore();

    const testingsCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'testings') as CollectionReference<Testing>;
    }, [firestore]);

    const { data: testings, loading } = useCollection<Testing>(testingsCollection);

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Testings</CardTitle>
                <CardDescription>
                Manage and review your A/B tests and other test results.
                </CardDescription>
            </div>
            <Button asChild>
                <Link href="/testings/add">Add Test</Link>
            </Button>
        </div>
      </CardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        {testings?.map(test => <TestingCard key={test.id} testing={test} />)}
      </div>
      {!loading && testings?.length === 0 && (
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                No tests found.
            </CardContent>
        </Card>
      )}
    </div>
  );
}
