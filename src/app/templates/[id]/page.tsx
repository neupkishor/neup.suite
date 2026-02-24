import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DeleteTemplateButton } from "./delete-button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const template = await prisma.template.findUnique({
        where: { id },
    });

    if (!template) {
        return notFound();
    }
  
    const createdDate = template.createdAt ? format(template.createdAt, 'PPP') : 'N/A';

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
                    <DeleteTemplateButton templateId={template.id} />
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
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs whitespace-pre-wrap font-mono">
                    {renderBody()}
                </pre>
            </div>
          </CardContent>
        </Card>
    );
}
