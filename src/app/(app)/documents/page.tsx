'use client';
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle, Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import Link from "next/link";
import { DocumentCard } from "./components/document-card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import type { Document } from "@/schemas/document";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadDocumentDialog } from "./components/upload-document-dialog";

function DocumentCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <Skeleton className="h-8 w-8" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
                 <Skeleton className="h-6 w-24" />
            </CardContent>
        </Card>
    )
}

export default function DocumentsPage() {
    const firestore = useFirestore();
    const documentsCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'documents') as CollectionReference<Document>;
    }, [firestore]);

    const { data: documents, loading } = useCollection<Document>(documentsCollection);

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline text-2xl">File & Document Repository</CardTitle>
                <CardDescription>Manage all your shared files, contracts, and assets.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <div className="grid grid-cols-1 gap-4">
        {!loading && (
            <UploadDocumentDialog>
                <div className="group cursor-pointer">
                    <Card className="border border-input hover:border-primary hover:text-primary transition-all">
                        <CardContent className="flex flex-row items-center p-4 gap-3">
                        <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                        <p className="font-medium">Upload File</p>
                        </CardContent>
                    </Card>
                </div>
            </UploadDocumentDialog>
        )}
        {loading && Array.from({ length: 3 }).map((_, i) => <DocumentCardSkeleton key={i} />)}
        {documents?.map((doc) => (
            <Link href={`/documents/${doc.id}`} key={doc.id}>
                <DocumentCard document={doc} />
            </Link>
        ))}
         {!loading && documents?.length === 0 && (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No documents found.
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
