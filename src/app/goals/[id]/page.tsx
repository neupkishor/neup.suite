
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DeleteGoalButton } from "./delete-button";
import { GoalStatus } from "@/generated/prisma";

const STATUS_LABELS: Record<GoalStatus, string> = {
    [GoalStatus.NotStarted]: 'Not Started',
    [GoalStatus.InProgress]: 'In Progress',
    [GoalStatus.Completed]: 'Completed',
    [GoalStatus.AtRisk]: 'At Risk',
};

export default async function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const goal = await prisma.goal.findUnique({
        where: { id },
    });

    if (!goal) {
        return notFound();
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-2xl">{goal.title}</CardTitle>
                        <CardDescription>
                            Status: {STATUS_LABELS[goal.status as GoalStatus]} | Target Date: {goal.targetDate.toLocaleDateString()}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href={`/goals/${id}/edit`}>Edit Goal</Link>
                        </Button>
                        <DeleteGoalButton goalId={id} />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p>{goal.description}</p>
            </CardContent>
        </Card>
    );
}
