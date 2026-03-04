
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProjectCard } from "./components/project-card";
import { AddItemCard } from "@/components/add-item-card";
import { FolderKanban } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Project, Client } from "@/generated/prisma";
import { getSession } from "@/actions/auth/session";

function ProjectCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-5 w-24" />
                </div>
                <div className="text-right">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-5 w-28" />
                </div>
            </CardContent>
        </Card>
    )
}

export default async function ProjectsPage() {
    const session = await getSession();
    if (!session) {
        return (
            <div className="text-center text-muted-foreground py-12">
                Please sign in to view your projects.
            </div>
        );
    }

    const cookieStore = await cookies();
    const clientId = cookieStore.get('client')?.value;

    const projects = await prisma.project.findMany({
        where: {
            project_owner: session.account_id,
            ...(clientId ? { working_with: clientId } : {})
        },
        orderBy: {
            created_on: 'asc',
        },
    });

    // If no specific client selected, fetch all clients to map names
    let clientsMap: Record<string, string> = {};
    if (!clientId) {
        const clients = await prisma.client.findMany();
        clients.forEach((c: Client) => {
            clientsMap[c.id] = c.name;
        });
    }

    const getClientName = (cId: string | null) => {
        if (!cId) return 'No Client';
        return clientsMap[cId] || 'No Client';
    }

  return (
    <div className="space-y-6">
        <CardHeader className="p-0">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-headline text-2xl font-semibold">Projects</h2>
                    <p className="text-muted-foreground">
                         {clientId ? "An overview of all projects for the selected client." : "An overview of all projects for all clients."}
                    </p>
                </div>
            </div>
        </CardHeader>

        <div className="grid grid-cols-1 gap-4">
            <AddItemCard 
                title="New Project" 
                href="/projects/create" 
                icon={FolderKanban}
            />
            
            {projects.map((project: Project) => (
                <Link href={`/projects/${project.id}`} key={project.id}>
                    <ProjectCard 
                        project={{
                            id: project.id,
                            name: project.name,
                            status: project.status,
                            deadline: project.deadline ? project.deadline.toLocaleDateString() : 'No Deadline',
                        }} 
                        clientName={!clientId ? getClientName(project.working_with) : undefined} 
                    />
                </Link>
            ))}
            
            {projects.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                    No projects found. Create one to get started!
                </div>
            )}
        </div>
    </div>
  );
}
