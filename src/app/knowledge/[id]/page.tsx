
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { use } from "react";

export default function KnowledgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-2xl">Article: {id}</CardTitle>
            <Button asChild>
                <Link href={`/knowledge/${id}/edit`}>Edit Article</Link>
            </Button>
        </div>
        <CardDescription>
          Viewing details for a knowledge base article.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Details for article {id} will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
