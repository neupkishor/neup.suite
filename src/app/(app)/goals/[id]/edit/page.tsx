
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalForm } from '@/app/(app)/goals/components/goal-form';
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GoalStatus } from "@/generated/prisma";

const STATUS_LABELS: Record<GoalStatus, string> = {
    [GoalStatus.NotStarted]: 'Not Started',
    [GoalStatus.InProgress]: 'In Progress',
    [GoalStatus.Completed]: 'Completed',
    [GoalStatus.AtRisk]: 'At Risk',
};

export default async function EditGoalPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const goal = await prisma.goal.findUnique({
        where: { id },
    });

    if (!goal) {
        return notFound();
    }

    const goalData = {
        ...goal,
        status: STATUS_LABELS[goal.status as GoalStatus] as any,
        description: goal.description || undefined,
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Edit Goal</CardTitle>
                <CardDescription>
                    Update the details of this goal or milestone.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <GoalForm goal={goalData} clientId={goal.clientId} />
            </CardContent>
        </Card>
    );
}
