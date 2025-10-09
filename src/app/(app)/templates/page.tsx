
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddItemCard } from "@/components/add-item-card";
import { FileStack } from "lucide-react";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference, query, where } from "firebase/firestore";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import type { Template } from "@/schemas/template";

function TemplateCard({ template }: { template: Template }) {
    return (
        <Card>
            <CardContent className="p-4">
                <Link href={`/templates/${template.id}`} className="font-semibold text-lg hover:underline">{template.name}</Link>
                <p className="text-sm text-muted-foreground">{template.description}</p>
                <p className="text-xs text-muted-foreground mt-2">Type: {template.type} | Version: {template.version}</p>
            </CardContent>
        </Card>
    )
}

export default function TemplatesPage() {
    const firestore = useFirestore();
    const [clientId, setClientId] = useState<string|null>(null);

    useEffect(() => {
        setClientId(Cookies.get('client') || null);
    }, []);

    const templatesCollection = useMemo(() => {
        if (!firestore || !clientId) return null;
        return query(
            collection(firestore, 'templates') as CollectionReference<Template>,
            where('clientId', '==', clientId)
        );
    }, [firestore, clientId]);

    const { data: templates, loading } = useCollection<Template>(templatesCollection);


  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Templates</CardTitle>
                <CardDescription>
                Create and manage reusable templates for your projects, tasks, and more.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
       {!clientId ? (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">Please select a client to manage their templates.</p>
                    <Button asChild><Link href="/clients">Select Client</Link></Button>
                </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {!loading && (
                    <AddItemCard
                        title="Create New Template"
                        href="/templates/create"
                        icon={FileStack}
                    />
                )}
                {loading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
                {templates?.map(item => <TemplateCard key={item.id} template={item} />)}
                {!loading && templates?.length === 0 && (
                    <Card>
                        <CardContent className="p-6 text-center text-muted-foreground">
                            No templates found for this client.
                        </CardContent>
                    </Card>
                )}
            </div>
        )}
    </div>
  );
}

    