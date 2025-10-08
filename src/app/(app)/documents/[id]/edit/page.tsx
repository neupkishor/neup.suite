
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

// Dummy data for a single document
const document = { id: '1', name: 'Master Service Agreement.pdf', version: 'v2.1', updated: '2024-05-20', status: 'Signed' };


export default function EditDocumentPage({ params }: { params: { id: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Edit Document: {document.name}</CardTitle>
        <CardDescription>
          Update the details of this document.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-w-2xl space-y-6">
        <div className="space-y-2">
            <Label htmlFor="name">Document Name</Label>
            <Input id="name" defaultValue={document.name} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input id="version" defaultValue={document.version} />
        </div>
        <div className="space-y-2">
             <Label htmlFor="status">Status</Label>
            <Select defaultValue={document.status}>
                <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Signed">Signed</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="In Review">In Review</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="flex gap-2">
            <Button>Save Changes</Button>
            <Button variant="outline" asChild><Link href={`/documents/${params.id}`}>Cancel</Link></Button>
        </div>
      </CardContent>
    </Card>
  );
}
