import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project } from "@/schemas/project";

// This is a placeholder for progress calculation logic.
const calculateProgress = (status: string) => {
  switch (status) {
    case 'Completed': return 100;
    case 'In Progress': return 60;
    case 'On Hold': return 20;
    case 'Planning': return 10;
    default: return 0;
  }
}

const projectColors = ["bg-primary", "bg-chart-2", "bg-chart-4"];

export function ProjectProgress({ projects }: { projects: Project[] | null }) {
  if (!projects) {
    return <Card>
      <CardHeader><CardTitle className="font-headline text-xl">Project Progress</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </CardContent>
    </Card>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Project Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.length > 0 ? projects.slice(0, 3).map((project, index) => {
          const progress = calculateProgress(project.status);
          return (
            <div key={project.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{project.name}</span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} indicatorClassName={projectColors[index % projectColors.length]} />
            </div>
          )
        }) : <p className="text-sm text-muted-foreground">No projects to display.</p>}
      </CardContent>
    </Card>
  );
}
