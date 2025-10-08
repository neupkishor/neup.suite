
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalForm } from '../components/goal-form';
import { useDoc } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { doc, DocumentReference } from "firebase/firestore";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Goal = {
    id: string;
    title: string;
    description: string;
    targetDate: string;
    status: string;
};


export default function EditGoalPage({ params }: { params: { id: string } }) {
    const firestore = useFirestore();
    const goalRef = useMemo(() => {
        if (!firestore || !params.id) return null;
        return doc(firestore, 'goals', params.id) as DocumentReference<Goal>;
    }, [firestore, params.id]);

    const { data: goal, loading } = useDoc<Goal>(goalRef);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Edit Goal</CardTitle>
        <CardDescription>
          Update the details of this goal or milestone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <Skeleton className="h-64" />}
        {goal && <GoalForm goal={goal} />}
      </CardContent>
    </Card>
  );
}
