
'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Project = {
    id: string;
    name: string;
    status: string;
    deadline: string;
};

const getStatusVariant = (status: string) => {
    switch(status) {
        case 'Completed': return 'default';
        case 'In Progress': return 'secondary';
        case 'On Hold': return 'destructive';
        default: return 'outline';
    }
}

export function ProjectCard({ project, clientName }: { project: Project, clientName?: string }) {
    return (
        <Card>
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                         {clientName && <Badge variant="outline">{clientName}</Badge>}
                    </div>
                </div>
                <div className="text-right">
                   <p className="text-sm text-muted-foreground">Deadline</p>
                   <p className="font-medium">{project.deadline}</p>
                </div>
            </CardContent>
        </Card>
    );
}
