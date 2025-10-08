import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderKanban } from "lucide-react";

export default function ProjectsPage() {
    const projects = [
        { name: 'Phoenix Project', status: 'In Progress', deadline: '2024-08-15' },
        { name: 'Odyssey Initiative', status: 'On Hold', deadline: '2024-09-01' },
        { name: 'Quantum Leap', status: 'Completed', deadline: '2024-07-20' },
        { name: 'Nebula', status: 'Planning', deadline: '2024-10-01' },
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
        <div className="flex items-center justify-between">
            <div>
                <h2 className="font-headline text-2xl font-semibold">Projects</h2>
                <p className="text-muted-foreground">An overview of all your ongoing and past projects.</p>
            </div>
            <Button>
                <FolderKanban className="mr-2 h-4 w-4"/>
                New Project
            </Button>
        </div>

        <div className="space-y-4">
            {projects.map(project => (
                <Card key={project.name}>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-lg">{project.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                            </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm text-muted-foreground">Deadline</p>
                           <p className="font-medium">{project.deadline}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
