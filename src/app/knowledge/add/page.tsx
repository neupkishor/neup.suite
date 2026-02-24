import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddKnowledgePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Add New Article</CardTitle>
        <CardDescription>
          Create a new article for the knowledge base.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Form to add a new knowledge base article will be here.</p>
      </CardContent>
    </Card>
  );
}
