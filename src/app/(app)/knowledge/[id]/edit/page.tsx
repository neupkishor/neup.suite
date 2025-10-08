import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditKnowledgePage({ params }: { params: { id: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Edit Article: {params.id}</CardTitle>
        <CardDescription>
          Update the details of this knowledge base article.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Form to edit article {params.id} will be here.</p>
      </CardContent>
    </Card>
  );
}
