import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DeleteProjectButton } from "./delete-button";

const getStatusVariant = (status: string) => {
    switch(status) {
        case 'Completed': return 'default';
        case 'In Progress': return 'secondary';
        case 'On Hold': return 'destructive';
        default: return 'outline';
    }
}

const formatStatus = (status: string) => {
    return status;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const project = await prisma.project.findUnique({
        where: { id },
    });

    if (!project) {
        return (
            <Card>
                <CardHeader><CardTitle>Project not found</CardTitle></CardHeader>
                <CardContent>
                    <p>The requested project could not be found.</p>
                    <Button asChild className="mt-4"><Link href="/projects">Go back to projects</Link></Button>
                </CardContent>
            </Card>
        );
    }

    // Fetch client details if associated
    let clientName = 'No Client';
    if (project.working_with) {
        const client = await prisma.client.findUnique({
            where: { id: project.working_with }
        });
        if (client) {
            clientName = client.name;
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-3xl font-bold">{project.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant={getStatusVariant(project.status)}>{formatStatus(project.status)}</Badge>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/projects/${project.id}/edit`}>Edit</Link>
                        </Button>
                        <DeleteProjectButton projectId={project.id} />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Deadline</p>
                        <p className="text-lg font-semibold">{project.deadline ? project.deadline.toLocaleDateString() : 'No Deadline'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Client</p>
                        <p className="text-lg font-semibold">{clientName}</p>
                    </div>
                    {/* Additional fields can be added here */}
                </div>
            </CardContent>
        </Card>
    );
}
