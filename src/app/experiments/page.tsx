
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference, query, where } from "firebase/firestore";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AddItemCard } from "@/components/add-item-card";
import { FlaskConical } from "lucide-react";
import Cookies from "js-cookie";

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
    const [clientId, setClientId] = useState<string|null>(null);

    useEffect(() => {
        setClientId(Cookies.get('client') || null);
    }, []);

    const experimentsCollection = useMemo(() => {
        if (!firestore || !clientId) return null;
        return query(
            collection(firestore, 'experiments') as CollectionReference<Experiment>,
            where('clientId', '==', clientId)
        );
    }, [firestore, clientId]);

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
        </div>
      </CardHeader>
      {!clientId ? (
        <Card>
            <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">Please select a client to manage their experiments.</p>
                <Button asChild><Link href="/clients">Select Client</Link></Button>
            </CardContent>
        </Card>
      ) : (
      <div className="grid grid-cols-1 gap-4">
        {!loading && (
            <AddItemCard
                title="Add Experiment"
                href="/experiments/add"
                icon={FlaskConical}
            />
        )}
        {loading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        {experiments?.map(exp => <ExperimentCard key={exp.id} experiment={exp} />)}
          {!loading && experiments?.length === 0 && (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No experiments found for this client.
                </CardContent>
            </Card>
        )}
      </div>
      )}
    </div>
  );
}
