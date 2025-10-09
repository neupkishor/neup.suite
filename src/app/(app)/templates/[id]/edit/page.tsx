
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateForm } from '../../components/template-form';
import { useDoc } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { doc, DocumentReference } from "firebase/firestore";
import { useMemo, use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Template } from "@/schemas/template";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const firestore = useFirestore();
    const templateRef = useMemo(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'templates', id) as DocumentReference<Template>;
    }, [firestore, id]);

    const { data: template, loading } = useDoc<Template>(templateRef);

    if (loading) {
        return (
             <div className="space-y-6">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <div className="space-y-8 max-w-2xl mt-6">
                    <Skeleton className="h-10" />
                    <Skeleton className="h-20" />
                    <Skeleton className="h-48" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>
        )
    }

    if (!template && !loading) {
        return <Card>
            <CardHeader><CardTitle>Template not found</CardTitle></CardHeader>
            <CardContent>
                <p>The requested template could not be found.</p>
                <Button asChild className="mt-4"><Link href="/templates">Back to Templates</Link></Button>
            </CardContent>
        </Card>
    }

  return (
    <div className="space-y-6">
       <div>
        <h1 className="font-headline text-2xl font-semibold">Create New Version of: {template?.name}</h1>
        <p className="text-muted-foreground text-sm">
          You are creating a new version of an existing template. The current version is {template?.version}. This will become version {(template?.version || 0) + 1}.
        </p>
      </div>
      <TemplateForm template={template} clientId={template.clientId} />
    </div>
  );
}
