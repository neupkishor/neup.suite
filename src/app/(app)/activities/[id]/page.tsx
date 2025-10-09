
'use client';
import { use, useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useDoc } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Activity } from "@/schemas/activity";
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Loader2, Edit, Trash2, Calendar, User, Link as LinkIcon, FileText, ChevronRight, Activity as ActivityIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteActivity } from '@/actions/activities/delete-activity';

export default function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const firestore = useFirestore();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const activityRef = useMemo(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'activities', id) as DocumentReference<Activity>;
    }, [firestore, id]);

    const { data: activity, loading } = useDoc<Activity & {createdOn: {seconds: number}}>(activityRef);

    const handleDelete = async () => {
      if (!firestore || !id) return;
      if (confirm('Are you sure you want to delete this activity?')) {
        setIsDeleting(true);
        try {
          await deleteActivity(firestore, id);
          router.push('/activities');
        } catch (error) {
          console.error('Failed to delete activity', error);
          setIsDeleting(false);
        }
      }
    };
    
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent className="space-y-8 mt-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (!activity) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Activity Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The activity you are looking for does not exist.</p>
                    <Button asChild className="mt-4">
                        <Link href="/activities">Back to Activities</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    const createdDate = activity.createdOn
        ? format(new Date(activity.createdOn.seconds * 1000), 'PPP')
        : 'N/A';

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <CardTitle className="font-headline text-3xl">{activity.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                             <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />Logged on {createdDate}</div>
                             <div className="flex items-center gap-1.5"><User className="h-4 w-4" />By {activity.createdBy || 'Unknown'}</div>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <Button asChild>
                            <Link href={`/activities/${id}/edit`}><Edit />Edit</Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting && <Loader2 className="animate-spin" />}
                           <Trash2 /> Delete
                        </Button>
                    </div>
                </div>
            </CardHeader>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><ActivityIcon />Activity Details</CardTitle></CardHeader>
                    <CardContent>
                        <h3 className="font-semibold">Description</h3>
                        <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{activity.description || 'No description provided.'}</p>
                        <h3 className="font-semibold mt-6">Results</h3>
                        <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{activity.results || 'No results provided.'}</p>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><LinkIcon />Links</CardTitle></CardHeader>
                    <CardContent>
                        {activity.links && activity.links.length > 0 ? (
                            <ul className="space-y-2">
                                {activity.links.map((link, index) => (
                                    <li key={index}>
                                        <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-primary hover:underline p-2 -m-2 rounded-md hover:bg-muted/50">
                                            <span className="truncate">{link}</span>
                                            <ChevronRight className="h-4 w-4 flex-shrink-0" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-sm text-muted-foreground">No links attached.</p>}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><FileText />Files</CardTitle></CardHeader>
                    <CardContent>
                        {activity.files && activity.files.length > 0 ? (
                            <ul className="space-y-2">
                                {activity.files.map((file, index) => (
                                    <li key={index}>
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-primary hover:underline p-2 -m-2 rounded-md hover:bg-muted/50">
                                            <span className="truncate">{file.name}</span>
                                            <ChevronRight className="h-4 w-4 flex-shrink-0" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-sm text-muted-foreground">No files attached.</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
