import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FolderKanban } from "lucide-react";

export default function ProjectsPage() {
    const projects = [
        { name: 'Phoenix Project', status: 'In Progress', progress: 85, deadline: '2024-08-15' },
        { name: 'Odyssey Initiative', status: 'On Hold', progress: 45, deadline: '2024-09-01' },
        { name: 'Quantum Leap', status: 'Completed', progress: 100, deadline: '2024-07-20' },
        { name: 'Nebula', status: 'Planning', progress: 10, deadline: '2024-10-01' },
    ];

    const getStatusVariant = (status: string) => {
        switch(status) {
            case 'Completed': return 'default';
            case 'In Progress': return 'secondary';
            case 'On Hold': return 'destructive';
            default: return 'outline';
        }
    }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-2xl">Projects</CardTitle>
                        <CardDescription>An overview of all your ongoing and past projects.</CardDescription>
                    </div>
                    <Button>
                        <FolderKanban className="mr-2 h-4 w-4"/>
                        New Project
                    </Button>
                </div>
            </CardHeader>
        </Card>

        <div className="space-y-4">
            {projects.map(project => (
                <Card key={project.name}>
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <div className="md:col-span-2">
                            <h3 className="font-semibold text-lg">{project.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                                <span className="text-sm text-muted-foreground">Deadline: {project.deadline}</span>
                            </div>
                        </div>
                        <div className="col-span-2 md:col-span-2">
                             <div className="flex items-center gap-4">
                                <Progress value={project.progress} className="h-2 flex-1" />
                                <span className="font-semibold text-muted-foreground w-12 text-right">{project.progress}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
