
'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDoc } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { doc, DocumentReference } from "firebase/firestore";
import Link from "next/link";
import { useMemo, use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    NRS: 'रु',
};

type Invoice = {
    id: string;
    invoiceId: string;
    title: string;
    description?: string;
    dueDate: string;
    status: 'Paid' | 'Due' | 'Overdue';
    amount: number;
    currency: keyof typeof currencySymbols;
    clientName: string;
};

const getStatusVariant = (status: string) => {
    switch(status) {
        case 'Paid': return 'default';
        case 'Due': return 'secondary';
        case 'Overdue': return 'destructive';
        default: return 'outline';
    }
}


export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const firestore = useFirestore();

    const invoiceRef = useMemo(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'invoices', id) as DocumentReference<Invoice>;
    }, [firestore, id]);

    const { data: invoice, loading } = useDoc<Invoice>(invoiceRef);

    if (loading) {
        return <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-20" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-12 w-full mt-4" />
                <div className="grid grid-cols-3 gap-6 mt-4">
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                     <div className="space-y-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                     <div className="space-y-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                </div>
            </CardContent>
        </Card>
    }

    if (!invoice) {
        return <Card>
            <CardHeader><CardTitle>Invoice not found</CardTitle></CardHeader>
            <CardContent>
                <p>The requested invoice could not be found.</p>
                <Button asChild className="mt-4"><Link href="/billing">Go back to billing</Link></Button>
            </CardContent>
        </Card>
    }
  
    const currencySymbol = currencySymbols[invoice.currency] || '$';

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <CardTitle className="font-headline text-3xl">{invoice.title}</CardTitle>
                        <CardDescription>Invoice {invoice.invoiceId} for {invoice.clientName}</CardDescription>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <Button asChild>
                            <Link href={`/billing/${id}/edit`}>Edit Invoice</Link>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                 {invoice.description && <p className="text-muted-foreground mb-6">{invoice.description}</p>}
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Status</p>
                        <Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground font-medium">Due Date</p>
                        <p>{format(new Date(invoice.dueDate), "PPP")}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Amount</p>
                        <p className="text-xl font-bold">{currencySymbol}{invoice.amount.toFixed(2)} <span className="text-sm text-muted-foreground">{invoice.currency}</span></p>
                    </div>
                 </div>
            </CardContent>
        </Card>
    </div>
  );
}

    