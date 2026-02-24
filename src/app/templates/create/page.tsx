
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateForm } from '@/app/(app)/templates/components/template-form';
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateTemplatePage() {
    const [clientId, setClientId] = useState<string|null>(null);

    useEffect(() => {
        setClientId(Cookies.get('client') || null);
    }, []);

    if (!clientId) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Client Not Selected</CardTitle>
                    <CardDescription>Please select a client before creating a new template.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/clients">Select a Client</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-semibold">Create New Template</h1>
        <p className="text-muted-foreground text-sm">
          Design a reusable template for projects, task lists, or documents.
        </p>
      </div>
      <TemplateForm clientId={clientId} />
    </div>
  );
}
