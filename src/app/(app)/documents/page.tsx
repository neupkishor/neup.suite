
'use client';
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle, Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import Link from "next/link";
import { DocumentCard } from "./components/document-card";
import { AddItemCard } from "@/components/add-item-card";

const documents = [
    { id: '1', name: 'Master Service Agreement.pdf', version: 'v2.1', updated: '2024-05-20', status: 'Signed' },
    { id: '2', name: 'Project Phoenix - SOW.docx', version: 'v1.3', updated: '2024-06-10', status: 'In Review' },
    { id: '3', name: 'Q3 Brand Assets.zip', version: 'v1.0', updated: '2024-07-02', status: 'Approved' },
    { id: '4', name: 'Initial Wireframes.fig', version: 'v0.8', updated: '2024-06-25', status: 'Archived' },
];


export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline text-2xl">File & Document Repository</CardTitle>
                <CardDescription>Manage all your shared files, contracts, and assets.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <div className="grid grid-cols-1 gap-4">
        <AddItemCard title="Upload File" href="#" icon={Upload} />
        {documents.map((doc) => (
            <Link href={`/documents/${doc.id}`} key={doc.id}>
                <DocumentCard document={doc} />
            </Link>
        ))}
         {documents.length === 0 && (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No documents found.
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
