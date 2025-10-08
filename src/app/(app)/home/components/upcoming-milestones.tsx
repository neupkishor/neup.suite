
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Flag } from "lucide-react";

export function UpcomingMilestones() {
  const milestones = [
    { name: "API Integration Complete", date: "1 week" },
    { name: "User Testing Phase Start", date: "3 weeks" },
    { name: "Project Go-Live", date: "5 weeks" },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Upcoming Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {milestones.map((milestone) => (
            <li key={milestone.name} className="flex items-start gap-4">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Flag className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">{milestone.name}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Due in {milestone.date}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
