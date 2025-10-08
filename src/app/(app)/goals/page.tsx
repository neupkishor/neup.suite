
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Target } from "lucide-react";

type Goal = {
    id: string;
    title: string;
    status: string;
};

function GoalCard({ goal }: { goal: Goal }) {
    return (
        <Card>
            <CardContent className="p-4">
                <Link href={`/goals/${goal.id}`} className="font-semibold text-lg hover:underline">{goal.title}</Link>
                <p className="text-sm text-muted-foreground">{goal.status}</p>
            </CardContent>
        </Card>
    )
}

export default function GoalsPage() {
    const firestore = useFirestore();

    const goalsCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'goals') as CollectionReference<Goal>;
    }, [firestore]);

    const { data: goals, loading } = useCollection<Goal>(goalsCollection);

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Goals & Milestones</CardTitle>
                <CardDescription>
                Track your project goals and major milestones.
                </CardDescription>
            </div>
            <Button asChild>
                <Link href="/goals/add"><Target className="mr-2 h-4 w-4"/>New Goal</Link>
            </Button>
        </div>
      </CardHeader>
      <div className="space-y-4">
        {loading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        {goals?.map(goal => <GoalCard key={goal.id} goal={goal} />)}
      </div>
      {!loading && goals?.length === 0 && (
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                No goals found.
            </CardContent>
        </Card>
      )}
    </div>
  );
}
