
'use client';
import { use } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useDoc } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { doc, DocumentReference } from 'firebase/firestore';
import { useMemo } from 'react';
import type { Document } from '@/schemas/document';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

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

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const firestore = useFirestore();
    const documentRef = useMemo(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'documents', id) as DocumentReference<Document>;
    }, [firestore, id]);

    const { data: document, loading } = useDoc<Document & {createdOn: {seconds: number}}>(documentRef);
    
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-2xl">{document.name}</CardTitle>
                <CardDescription>
                    {document.version ? `Version ${document.version} - ` : ''} 
                    Last updated on {createdDate}
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button asChild>
                    <Link href={`/documents/${id}/edit`}>Edit</Link>
                </Button>
                 <Button variant="destructive">Delete</Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Badge variant={getStatusVariant(document.status)}>{document.status}</Badge>
        <div className="mt-4 prose max-w-none">
            <p>Document content preview will be available here.</p>
            <p>URL: <a href={document.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{document.url}</a></p>
        </div>
      </CardContent>
    </Card>
  );
}
