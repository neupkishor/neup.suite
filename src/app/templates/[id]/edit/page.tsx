import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateForm } from '@/app/templates/components/template-form';
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const template = await prisma.template.findUnique({
        where: { id },
    });

    if (!template) {
        return notFound();
    }

  return (
    <div className="space-y-6">
       <div>
        <h1 className="font-headline text-2xl font-semibold">Create New Version of: {template.name}</h1>
        <p className="text-muted-foreground text-sm">
          You are creating a new version of an existing template. The current version is {template.version}. This will become version {(template.version || 0) + 1}.
        </p>
      </div>
      <TemplateForm template={{...template, description: template.description || undefined}} clientId={template.clientId} />
    </div>
  );
}
