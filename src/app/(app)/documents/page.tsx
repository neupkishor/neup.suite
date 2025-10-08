
'use client';
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import Link from "next/link";
import { DocumentCard } from "./components/document-card";

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
            <Button>
                <Upload className="mr-2 h-4 w-4"/>
                Upload File
            </Button>
        </div>
      </CardHeader>
      <div className="space-y-4">
        {documents.map((doc) => (
            <Link href={`/documents/${doc.id}`} key={doc.id}>
                <DocumentCard document={doc} />
            </Link>
        ))}
      </div>
    </div>
  );
}
