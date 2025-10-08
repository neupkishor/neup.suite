import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilePlus, MoreHorizontal, Upload } from "lucide-react";

export default function DocumentsPage() {
    const documents = [
        { name: 'Master Service Agreement.pdf', version: 'v2.1', updated: '2024-05-20', status: 'Signed' },
        { name: 'Project Phoenix - SOW.docx', version: 'v1.3', updated: '2024-06-10', status: 'In Review' },
        { name: 'Q3 Brand Assets.zip', version: 'v1.0', updated: '2024-07-02', status: 'Approved' },
        { name: 'Initial Wireframes.fig', version: 'v0.8', updated: '2024-06-25', status: 'Archived' },
    ];
    
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

  return (
    <Card>
      <CardHeader>
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
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {documents.map((doc) => (
                    <TableRow key={doc.name}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>{doc.version}</TableCell>
                        <TableCell>{doc.updated}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(doc.status)}>{doc.status}</Badge>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>Download</DropdownMenuItem>
                                    <DropdownMenuItem>View History</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
