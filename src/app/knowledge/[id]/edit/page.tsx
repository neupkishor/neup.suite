
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { use } from "react";

export default function EditKnowledgePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Edit Article: {id}</CardTitle>
        <CardDescription>
          Update the details of this knowledge base article.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Form to edit article {id} will be here.</p>
      </CardContent>
    </Card>
  );
}
