import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function KnowledgePage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-2xl">Knowledge Base</CardTitle>
            <Button asChild>
                <Link href="/knowledge/add">Add Article</Link>
            </Button>
        </div>
        <CardDescription>
          Browse and manage your internal knowledge base.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>List of knowledge base articles will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
