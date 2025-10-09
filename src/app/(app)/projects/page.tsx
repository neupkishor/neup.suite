
'use client';
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference, query, where, DocumentData } from "firebase/firestore";
import { useMemo, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { ProjectCard } from "./components/project-card";
import { AddItemCard } from "@/components/add-item-card";
import { FolderKanban } from "lucide-react";
import Cookies from "js-cookie";
import type { Client } from "@/schemas/client";

type Project = {
    id: string;
    name: string;
    status: string;
    deadline: string;
    clientId: string;
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
    const [clientId, setClientId] = useState<string | null>(null);

    useEffect(() => {
        setClientId(Cookies.get('client') || null);
    }, [])

    const projectsCollection = useMemo(() => {
        if (!firestore) return null;
        let q = collection(firestore, 'projects') as CollectionReference<Project>;
        if (clientId) {
            return query(q, where('clientId', '==', clientId));
        }
        return query(q);
    }, [firestore, clientId]);
    const { data: projects, loading: projectsLoading } = useCollection<Project>(projectsCollection);

    const clientsCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'clients') as CollectionReference<Client>;
    }, [firestore]);
    const { data: clients, loading: clientsLoading } = useCollection<Client>(clientsCollection);

    const loading = projectsLoading || clientsLoading;

    const getClientName = (cId: string) => {
        return clients?.find(c => c.id === cId)?.name || 'Unknown Client';
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
                    <ProjectCard project={project} clientName={!clientId ? getClientName(project.clientId) : undefined} />
                </Link>
            ))}
            {!loading && projects?.length === 0 && (
                <Card>
                    <CardContent className="p-4 text-center text-muted-foreground">
                        No projects found.
                    </CardContent>
                </Card>
            )}
        </div>
    </div>
  );
}
