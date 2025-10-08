import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function KnowledgeDetailPage({ params }: { params: { id: string } }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-2xl">Article: {params.id}</CardTitle>
            <Button asChild>
                <Link href={`/knowledge/${params.id}/edit`}>Edit Article</Link>
            </Button>
        </div>
        <CardDescription>
          Viewing details for a knowledge base article.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Details for article {params.id} will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
