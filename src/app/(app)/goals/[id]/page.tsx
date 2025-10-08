
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useDoc } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { doc, DocumentReference } from "firebase/firestore";
import { useMemo, use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteGoal } from '../actions/delete-goal';
import { useRouter } from "next/navigation";

type Goal = {
    id: string;
    title: string;
    description: string;
    targetDate: string;
    status: string;
};

export default function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const firestore = useFirestore();
    const router = useRouter();

    const goalRef = useMemo(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'goals', id) as DocumentReference<Goal>;
    }, [firestore, id]);

    const { data: goal, loading } = useDoc<Goal>(goalRef);

    const handleDelete = async () => {
        if (!firestore || !id) return;
        if (confirm('Are you sure you want to delete this goal?')) {
            await deleteGoal(firestore, id);
            router.push('/goals');
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

  if (!goal) {
    return <Card><CardHeader><CardTitle>Goal not found</CardTitle></CardHeader></Card>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-2xl">{goal.title}</CardTitle>
                <CardDescription>
                    Status: {goal.status} | Target Date: {goal.targetDate}
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button asChild>
                    <Link href={`/goals/${id}/edit`}>Edit Goal</Link>
                </Button>
                 <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{goal.description}</p>
      </CardContent>
    </Card>
  );
}
