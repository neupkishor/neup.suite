
'use client';
import { use } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useDoc } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { doc, DocumentReference } from 'firebase/firestore';
import { useMemo } from 'react';
import type { Document } from '@/schemas/document';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { File, Calendar, User, FileText, Hash, HardDrive } from 'lucide-react';
import { DocumentPreview } from '../components/document-preview';

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Signed':
        case 'Approved':
            return 'default';
        case 'In Review':
            return 'secondary';
        default:
            return 'outline';
    }
};

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const firestore = useFirestore();
    const documentRef = useMemo(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'documents', id) as DocumentReference<Document>;
    }, [firestore, id]);

    const { data: document, loading } = useDoc<Document & {createdOn: {seconds: number}, updatedOn: {seconds: number}}>(documentRef);
    
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-6 w-24 mt-4" />
                    <Skeleton className="h-40 w-full mt-4" />
                </CardContent>
            </Card>
        )
    }

    if (!document) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Document Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The document you are looking for does not exist.</p>
                    <Button asChild className="mt-4">
                        <Link href="/documents">Back to Documents</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    const createdDate = document.createdOn
    ? format(new Date(document.createdOn.seconds * 1000), 'PPP')
    : 'N/A';
     const updatedDate = document.updatedOn
    ? format(new Date(document.updatedOn.seconds * 1000), 'PPP')
    : 'N/A';

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">{document.name}</CardTitle>
                <CardDescription>
                    Version {document.version || '1.0'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DocumentPreview url={document.url} fileType={document.fileType || ''} />
                {document.notes && <blockquote className="mt-4 border-l-2 pl-6 italic">{document.notes}</blockquote>}
            </CardContent>
             <CardFooter className="flex justify-end gap-2">
                <Button asChild>
                    <Link href={`/documents/${id}/edit`}>Edit</Link>
                </Button>
                <Button variant="destructive">Delete</Button>
            </CardFooter>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Document Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                <div className="flex items-start gap-3">
                    <File className="h-5 w-5 text-muted-foreground mt-0.5"/>
                    <div>
                        <p className="text-muted-foreground">Status</p>
                        <Badge variant={getStatusVariant(document.status)}>{document.status}</Badge>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5"/>
                    <div>
                        <p className="text-muted-foreground">Uploaded By</p>
                        <p>{document.uploadedBy || 'N/A'}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5"/>
                    <div>
                        <p className="text-muted-foreground">Uploaded On</p>
                        <p>{createdDate}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5"/>
                    <div>
                        <p className="text-muted-foreground">File Type</p>
                        <p>{document.fileType || 'N/A'}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <HardDrive className="h-5 w-5 text-muted-foreground mt-0.5"/>
                    <div>
                        <p className="text-muted-foreground">File Size</p>
                        <p>{document.size ? formatBytes(document.size) : 'N/A'}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Hash className="h-5 w-5 text-muted-foreground mt-0.5"/>
                    <div>
                        <p className="text-muted-foreground">Version</p>
                        <p>{document.version || '1.0'}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
