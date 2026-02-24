
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Target } from "lucide-react";
import { AddItemCard } from "@/components/add-item-card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { Goal, GoalStatus } from "@/generated/prisma";

const STATUS_LABELS: Record<GoalStatus, string> = {
    [GoalStatus.NotStarted]: 'Not Started',
    [GoalStatus.InProgress]: 'In Progress',
    [GoalStatus.Completed]: 'Completed',
    [GoalStatus.AtRisk]: 'At Risk',
};

function GoalCard({ goal }: { goal: Goal }) {
    return (
        <Card>
            <CardContent className="p-4">
                <Link href={`/goals/${goal.id}`} className="font-semibold text-lg hover:underline">{goal.title}</Link>
                <p className="text-sm text-muted-foreground">{STATUS_LABELS[goal.status]}</p>
            </CardContent>
        </Card>
    )
}

export default async function GoalsPage() {
    const cookieStore = await cookies();
    const clientId = cookieStore.get('client')?.value;

    const goals = clientId ? await prisma.goal.findMany({
        where: { clientId: clientId },
        orderBy: { createdAt: 'desc' }
    }) : [];

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
        </div>
      </CardHeader>
       {!clientId ? (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">Please select a client to manage their goals.</p>
                    <Button asChild><Link href="/clients">Select Client</Link></Button>
                </CardContent>
            </Card>
        ) : (
      <div className="grid grid-cols-1 gap-4">
        <AddItemCard
            title="New Goal"
            href="/goals/add"
            icon={Target}
        />
        {goals.map((goal: Goal) => <GoalCard key={goal.id} goal={goal} />)}
          {goals.length === 0 && (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No goals found for this client.
                </CardContent>
            </Card>
        )}
      </div>
      )}
    </div>
  );
}
