
'use client';
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference, query, where } from "firebase/firestore";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { ProjectCard } from "./components/project-card";
import { AddItemCard } from "@/components/add-item-card";
import { FolderKanban } from "lucide-react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";

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
    const [clientId, setClientId] = useState<string | null>(Cookies.get('client') || null);

    const projectsCollection = useMemo(() => {
        if (!firestore || !clientId) return null;
        return query(
            collection(firestore, 'projects') as CollectionReference<Project>,
            where('clientId', '==', clientId)
        );
    }, [firestore, clientId]);

    const { data: projects, loading } = useCollection<Project>(projectsCollection);

  return (
    <div className="space-y-6">
        <CardHeader className="p-0">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-headline text-2xl font-semibold">Projects</h2>
                    <p className="text-muted-foreground">An overview of all your ongoing and past projects.</p>
                </div>
            </div>
        </CardHeader>

        {!clientId ? (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">Please select a client to view their projects.</p>
                    <Button asChild>
                        <Link href="/clients">Select Client</Link>
                    </Button>
                </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {!loading && (
                    <AddItemCard 
                        title="New Project" 
                        href="/projects/create" 
                        icon={FolderKanban}
                    />
                )}
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
                            No projects found for this client. Create one to get started.
                        </CardContent>
                    </Card>
                )}
            </div>
        )}
    </div>
  );
}
