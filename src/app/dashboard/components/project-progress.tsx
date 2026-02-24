import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ProjectProgress() {
  const projects = [
    { name: "Phoenix Project", progress: 85, color: "bg-primary" },
    { name: "Odyssey Initiative", progress: 45, color: "bg-chart-2" },
    { name: "Quantum Leap", progress: 60, color: "bg-chart-4" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Project Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project) => (
          <div key={project.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{project.name}</span>
              <span className="text-muted-foreground">{project.progress}%</span>
            </div>
            <Progress value={project.progress} indicatorClassName={project.color} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
