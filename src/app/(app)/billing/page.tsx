'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import { Download, MoreHorizontal, Receipt } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

type Invoice = {
    id: string;
    invoiceId: string;
    dueDate: string;
    status: 'Paid' | 'Due' | 'Overdue';
    amount: number;
    clientName: string;
}

export default function BillingPage() {
    const firestore = useFirestore();

    const invoicesCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'invoices') as CollectionReference<Invoice>;
    }, [firestore]);

    const { data: invoices, loading } = useCollection<Invoice>(invoicesCollection);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Paid': return 'default';
            case 'Due': return 'secondary';
            case 'Overdue': return 'destructive';
            default: return 'outline';
        }
    }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline text-2xl">Billing & Invoices</CardTitle>
                <CardDescription>View your payment history and download invoices.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline">
                    <Receipt className="mr-2 h-4 w-4"/>
                    Payment Methods
                </Button>
                <Button asChild>
                    <Link href="/billing/add">New Invoice</Link>
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading && Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                ))}
                {!loading && invoices?.map((invoice) => (
                    <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                        <TableCell>{invoice.clientName}</TableCell>
                        <TableCell>{format(new Date(invoice.dueDate), 'PPP')}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge>
                        </TableCell>
                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/billing/${invoice.id}/edit`}>Edit</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Download PDF</DropdownMenuItem>
                                     {invoice.status === 'Due' && <DropdownMenuItem>Mark as Paid</DropdownMenuItem>}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
         {!loading && invoices?.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
                No invoices found.
            </div>
         )}
      </CardContent>
    </Card>
  );
}
