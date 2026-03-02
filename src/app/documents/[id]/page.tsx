import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DeleteDocumentButton } from '@/app/documents/[id]/delete-button';
import { File, Calendar, User, FileText, Hash, HardDrive, ExternalLink } from 'lucide-react';

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Signed':
        case 'Approved':
            return 'default';
        case 'In Review':
        case 'InReview':
            return 'secondary';
        default:
            return 'outline';
    }
};

const formatBytes = (bytes: number | null, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const document = await prisma.document.findUnique({
        where: { id },
        // include: { client: true } // Relation removed
    });

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

    const createdDate = document.created_at
        ? format(document.created_at, 'PPP')
        : 'N/A';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{document.title}</h1>
                    <div className="flex items-center mt-2 space-x-2 text-muted-foreground">
                        <Badge variant={getStatusVariant(document.status) as any}>
                            {document.status === 'InReview' ? 'In Review' : document.status}
                        </Badge>
                        <span>•</span>
                        <span>Version {document.version || '1.0'}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <a href={document.file_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open
                        </a>
                    </Button>
                    <DeleteDocumentButton documentId={document.id} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>File Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center">
                            <File className="mr-2 h-4 w-4 opacity-70" />
                            <span className="font-medium mr-2">Type:</span>
                            <span>{document.file_type || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center">
                            <HardDrive className="mr-2 h-4 w-4 opacity-70" />
                            <span className="font-medium mr-2">Size:</span>
                            <span>{formatBytes(document.size)}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 opacity-70" />
                            <span className="font-medium mr-2">Uploaded:</span>
                            <span>{createdDate}</span>
                        </div>
                         <div className="flex items-center">
                            <User className="mr-2 h-4 w-4 opacity-70" />
                            <span className="font-medium mr-2">Uploaded By:</span>
                            <span>{document.uploaded_by || 'Unknown'}</span>
                        </div>
                         <div className="flex items-center">
                            <Hash className="mr-2 h-4 w-4 opacity-70" />
                            <span className="font-medium mr-2">ID:</span>
                            <span className="text-sm font-mono">{document.id}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {document.notes ? (
                            <p className="whitespace-pre-wrap">{document.notes}</p>
                        ) : (
                            <p className="text-muted-foreground italic">No notes added.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
