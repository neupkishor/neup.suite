
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Dummy data for a single document
const document = { id: '1', name: 'Master Service Agreement.pdf', version: 'v2.1', updated: '2024-05-20', status: 'Signed', content: 'This is the content of the master service agreement.' };

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Signed':
        case 'Approved':
            return 'default';
        case 'In Review':
            return 'secondary';
        default:
            return 'outline';
    }
};

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
    // In a real app, you would fetch the document data based on params.id
    // For now, we'll use the dummy data.
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-2xl">{document.name}</CardTitle>
                <CardDescription>
                    Version {document.version} - Last updated on {document.updated}
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button asChild>
                    <Link href={`/documents/${params.id}/edit`}>Edit</Link>
                </Button>
                 <Button variant="destructive">Delete</Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Badge variant={getStatusVariant(document.status)}>{document.status}</Badge>
        <div className="mt-4 prose max-w-none">
            <p>{document.content}</p>
        </div>
      </CardContent>
    </Card>
  );
}
