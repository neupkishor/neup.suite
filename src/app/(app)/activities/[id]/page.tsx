import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Loader2, Edit, Trash2, Calendar, User, Link as LinkIcon, FileText, Activity as ActivityIcon } from 'lucide-react';
import { format } from 'date-fns';
import { notFound } from "next/navigation";
import { DeleteActivityButton } from "./delete-button";

export default async function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const activity = await prisma.activity.findUnique({
        where: { id },
    });

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

    const createdDate = activity.createdAt
        ? format(activity.createdAt, 'PPP')
        : 'N/A';
    
    // Parse JSON fields
    const files = (activity.files as any[]) || [];

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <CardTitle className="font-headline text-3xl">{activity.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                             <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />Logged on {createdDate}</div>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <Button asChild>
                            <Link href={`/activities/${id}/edit`}><Edit className="mr-2 h-4 w-4" />Edit</Link>
                        </Button>
                        <DeleteActivityButton activityId={activity.id} />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                         <h3 className="text-lg font-semibold flex items-center gap-2"><ActivityIcon className="h-5 w-5" /> Description</h3>
                         <p className="whitespace-pre-wrap text-sm">{activity.description || 'No description provided.'}</p>
                    </div>

                    {activity.results && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2"><FileText className="h-5 w-5" /> Results / Outcome</h3>
                            <p className="whitespace-pre-wrap text-sm">{activity.results}</p>
                        </div>
                    )}
                </div>

                {(activity.links.length > 0 || files.length > 0) && (
                    <div className="pt-4 border-t">
                        <h3 className="text-lg font-semibold mb-4">Attachments & Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activity.links.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Links</h4>
                                    <ul className="space-y-2">
                                        {activity.links.map((link, idx) => (
                                            <li key={idx}>
                                                <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline truncate">
                                                    <LinkIcon className="h-4 w-4" />
                                                    {link}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                             {files.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Files</h4>
                                    <ul className="space-y-2">
                                        {files.map((file: any, idx: number) => (
                                            <li key={idx}>
                                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline truncate">
                                                    <FileText className="h-4 w-4" />
                                                    {file.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
