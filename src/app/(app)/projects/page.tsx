import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline text-2xl">Projects</CardTitle>
                <CardDescription>An overview of all your ongoing and past projects.</CardDescription>
            </div>
            <Button>
                <FolderKanban />
                New Project
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[300px]">Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Deadline</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {projects.map(project => (
                    <TableRow key={project.name}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                        </TableCell>
                        <TableCell>
                            <Progress value={project.progress} className="h-2" />
                        </TableCell>
                        <TableCell className="text-right">{project.deadline}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
