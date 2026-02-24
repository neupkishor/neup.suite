import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Flag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Goal } from "@/schemas/goal";
import { format, differenceInDays } from 'date-fns';

const getDueDateText = (targetDate: string | Date) => {
    const days = differenceInDays(new Date(targetDate), new Date());
    if (days < 0) return `Overdue by ${Math.abs(days)} days`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due in 1 day';
    return `Due in ${days} days`;
};

export function UpcomingMilestones({ goals }: { goals: Goal[] | null }) {
  if (!goals) {
      return <Card>
      <CardHeader><CardTitle className="font-headline text-xl">Upcoming Milestones</CardTitle></CardHeader>
      <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
      </CardContent>
      </Card>
  }
  
  const upcomingGoals = goals
    .filter(goal => goal.status !== 'Completed')
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Upcoming Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingGoals.length > 0 ? (
          <ul className="space-y-4">
            {upcomingGoals.map((goal) => (
              <li key={goal.id} className="flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Flag className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{goal.title}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{getDueDateText(goal.targetDate)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted-foreground">No upcoming milestones.</p>}
      </CardContent>
    </Card>
  );
}
