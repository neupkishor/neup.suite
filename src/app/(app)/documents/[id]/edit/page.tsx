
'use client';
import { use, useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useDoc } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { doc, DocumentReference, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { Document } from "@/schemas/document";
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const firestore = useFirestore();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const documentRef = useMemo(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'documents', id) as DocumentReference<Document>;
  }, [firestore, id]);

  const { data: document, loading } = useDoc<Document>(documentRef);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore || !documentRef) return;
    
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const dataToUpdate = {
        name: formData.get('name') as string,
        version: formData.get('version') as string,
        status: formData.get('status') as string,
        notes: formData.get('notes') as string,
        updatedOn: serverTimestamp(),
    };

    try {
        await updateDoc(documentRef, dataToUpdate);
        router.push(`/documents/${id}`);
    } catch(error) {
        console.error("Failed to update document: ", error);
        setIsSubmitting(false);
    }
  }
  
  if (loading || !document) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6 mt-4 max-w-2xl">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-20 w-full" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Edit Document: {document.name}</CardTitle>
        <CardDescription>
          Update the details of this document.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Document Name</Label>
                <Input id="name" name="name" defaultValue={document.name} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input id="version" name="version" defaultValue={document.version} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={document.status}>
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Signed">Signed</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="In Review">In Review</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" defaultValue={document.notes} />
            </div>
            <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                    Save Changes
                </Button>
                <Button variant="outline" asChild><Link href={`/documents/${id}`}>Cancel</Link></Button>
            </div>
        </form>
      </CardContent>
    </Card>
  );
}
