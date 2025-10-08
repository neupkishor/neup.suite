
'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDoc } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { doc, DocumentReference } from "firebase/firestore";
import Link from "next/link";
import { useMemo, useState, use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/actions/projects/delete-project";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

type Project = {
    id: string;
    name: string;
    identifier: string;
    status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
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


export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const firestore = useFirestore();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const projectRef = useMemo(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'projects', id) as DocumentReference<Project>;
    }, [firestore, id]);

    const { data: project, loading } = useDoc<Project>(projectRef);

    const handleDelete = async () => {
        if (!firestore || !id) return;
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            setIsDeleting(true);
            try {
                await deleteProject(firestore, id);
                router.push('/projects');
            } catch (error) {
                console.error("Error deleting project:", error);
                setIsDeleting(false);
            }
        }
    }

    if (loading) {
        return <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-20" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-6 mt-4">
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                     <div className="space-y-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                     <div className="space-y-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                </div>
            </CardContent>
        </Card>
    }

    if (!project) {
        return <Card>
            <CardHeader><CardTitle>Project not found</CardTitle></CardHeader>
            <CardContent>
                <p>The requested project could not be found.</p>
                <Button asChild className="mt-4"><Link href="/projects">Go back to projects</Link></Button>
            </CardContent>
        </Card>
    }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <CardTitle className="font-headline text-3xl">{project.name}</CardTitle>
                        <CardDescription>#{project.identifier}</CardDescription>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <Button asChild>
                            <Link href={`/projects/${id}/edit`}>Edit Project</Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Project
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Status</p>
                        <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground font-medium">Deadline</p>
                        <p>{format(new Date(project.deadline), "PPP")}</p>
                    </div>
                 </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Tasks associated with this project will be shown here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
