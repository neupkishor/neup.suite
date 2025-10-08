
'use client';
import { Button } from "@/components/ui/button";
import { FolderKanban } from "lucide-react";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectCard } from "./components/project-card";

type Project = {
    id: string;
    name: string;
    status: string;
    deadline: string;
};

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

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="font-headline text-2xl font-semibold">Projects</h2>
                <p className="text-muted-foreground">An overview of all your ongoing and past projects.</p>
            </div>
            <Button asChild>
                <Link href="/projects/create">
                    <FolderKanban className="mr-2 h-4 w-4"/>
                    New Project
                </Link>
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
                <Link href={`/projects/${project.id}`} key={project.id}>
                    <ProjectCard project={project} />
                </Link>
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
