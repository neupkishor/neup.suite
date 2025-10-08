
'use client';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

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

type Document = {
    id: string;
    name: string;
    version: string;
    updated: string;
    status: string;
};

export function DocumentCard({ document }: { document: Document }) {
    return (
        <Card>
            <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                        <p className="font-semibold">{document.name}</p>
                        <p className="text-sm text-muted-foreground">
                            Version {document.version} - Updated {document.updated}
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
