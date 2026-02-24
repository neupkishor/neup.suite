
'use client';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { Document } from "@/schemas/document";
import { format } from "date-fns";

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

type DocumentWithTimestamps = Document & {
    createdOn?: { seconds: number; nanoseconds: number };
}

export function DocumentCard({ document }: { document: DocumentWithTimestamps }) {
    const updatedDate = document.createdOn
    ? format(new Date(document.createdOn.seconds * 1000), 'yyyy-MM-dd')
    : 'N/A';
    
    return (
        <Card>
            <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                        <p className="font-semibold">{document.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {document.version ? `Version ${document.version} - ` : ''}
                            Updated {updatedDate}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <Badge variant={getStatusVariant(document.status)}>{document.status}</Badge>
                </div>
            </CardContent>
        </Card>
    )
}
