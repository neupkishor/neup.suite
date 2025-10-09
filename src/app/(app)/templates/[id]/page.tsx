
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useDoc } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { doc, DocumentReference } from "firebase/firestore";
import { useMemo, use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteTemplate } from '../actions/delete-template';
import { useRouter } from "next/navigation";
import type { Template } from "@/schemas/template";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type TemplateWithTimestamp = Template & {
    createdOn: { seconds: number };
}

export default function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const firestore = useFirestore();
    const router = useRouter();

    const templateRef = useMemo(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'templates', id) as DocumentReference<TemplateWithTimestamp>;
    }, [firestore, id]);

    const { data: template, loading } = useDoc<TemplateWithTimestamp>(templateRef);

    const handleDelete = async () => {
        if (!firestore || !id) return;
        if (confirm('Are you sure you want to delete this template?')) {
            await deleteTemplate(firestore, id);
            router.push('/templates');
        }
    }

  if (loading) {
    return <Card>
        <CardHeader><Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-1/2 mt-2" /></CardHeader>
        <CardContent className="space-y-4 mt-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
        </CardContent>
    </Card>
  }

  if (!template) {
    return <Card>
        <CardHeader><CardTitle>Template not found</CardTitle></CardHeader>
         <CardContent>
            <p>The requested template could not be found.</p>
            <Button asChild className="mt-4"><Link href="/templates">Back to Templates</Link></Button>
        </CardContent>
    </Card>
  }
  
  const createdDate = template.createdOn ? format(new Date(template.createdOn.seconds * 1000), 'PPP') : 'N/A';

  const renderBody = () => {
      if (template.type === 'TaskList') {
          try {
              const tasks = JSON.parse(template.body);
              return JSON.stringify(tasks, null, 2);
          } catch(e) {
              return "Invalid JSON in template body.";
          }
      }
      return template.body;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-2xl">{template.name}</CardTitle>
                <CardDescription>
                    <Badge variant="secondary" className="mr-2">{template.type}</Badge>
                    Version {template.version} - Created on {createdDate}
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button asChild>
                    <Link href={`/templates/${id}/edit`}>Create New Version</Link>
                </Button>
                 <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
            <h3 className="font-semibold">Description</h3>
            <p className="text-muted-foreground">{template.description || 'No description provided.'}</p>
        </div>
        <div>
            <h3 className="font-semibold">Template Body</h3>
            <pre className="mt-2 text-sm bg-muted p-4 rounded-md overflow-auto font-mono">
                {renderBody()}
            </pre>
        </div>
      </CardContent>
    </Card>
  );
}

    
