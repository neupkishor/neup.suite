'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Experiment = {
    id: string;
    name: string;
    status: string;
};

function ExperimentCard({ experiment }: { experiment: Experiment }) {
    return (
        <Card>
            <CardContent className="p-4">
                <Link href={`/experiments/${experiment.id}`} className="font-semibold text-lg hover:underline">{experiment.name}</Link>
                <p className="text-sm text-muted-foreground">{experiment.status}</p>
            </CardContent>
        </Card>
    )
}

export default function ExperimentsPage() {
    const firestore = useFirestore();

    const experimentsCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'experiments') as CollectionReference<Experiment>;
    }, [firestore]);

    const { data: experiments, loading } = useCollection<Experiment>(experimentsCollection);

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Experiments</CardTitle>
                <CardDescription>
                Track your ongoing and completed experiments.
                </CardDescription>
            </div>
            <Button asChild>
                <Link href="/experiments/add">Add Experiment</Link>
            </Button>
        </div>
      </CardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        {experiments?.map(exp => <ExperimentCard key={exp.id} experiment={exp} />)}
      </div>
      {!loading && experiments?.length === 0 && (
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                No experiments found.
            </CardContent>
        </Card>
      )}
    </div>
  );
}
