'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderKanban, Loader2 } from "lucide-react";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { createProject } from "@/firebase/firestore/projects";
import { Skeleton } from "@/components/ui/skeleton";

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

function ProjectCard({ project }: { project: Project }) {
    return (
        <Card>
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
    );
}

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

export default function ProjectsPage() {
    const firestore = useFirestore();
    const projectsCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'projects') as CollectionReference<Project>;
    }, [firestore]);

    const { data: projects, loading } = useCollection<Project>(projectsCollection);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        // Create a sample project if there are none.
        if (!loading && projects && projects.length === 0 && firestore) {
            const newProject = {
                identifier: 'phoenix-project',
                name: 'Phoenix Project',
                status: 'In Progress',
                deadline: '2024-08-15',
            };
            createProject(firestore, newProject);
        }
    }, [loading, projects, firestore]);

    const handleCreateProject = async () => {
        if (!firestore) return;
        setIsCreating(true);
        const newProject = {
            identifier: `new-project-${Date.now()}`,
            name: `New Project ${projects ? projects.length + 1 : 1}`,
            status: 'Planning',
            deadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], // 30 days from now
        }
        await createProject(firestore, newProject);
        setIsCreating(false);
    }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="font-headline text-2xl font-semibold">Projects</h2>
                <p className="text-muted-foreground">An overview of all your ongoing and past projects.</p>
            </div>
            <Button onClick={handleCreateProject} disabled={isCreating}>
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FolderKanban className="mr-2 h-4 w-4"/>}
                New Project
            </Button>
        </div>

        <div className="space-y-4">
            {loading && (
                <>
                    <ProjectCardSkeleton />
                    <ProjectCardSkeleton />
                </>
            )}
            {!loading && projects && projects.map(project => (
                <ProjectCard key={project.id} project={project} />
            ))}
            {!loading && projects?.length === 0 && (
                <Card>
                    <CardContent className="p-4 text-center text-muted-foreground">
                        No projects found. Create one to get started.
                    </CardContent>
                </Card>
            )}
        </div>
    </div>
  );
}
