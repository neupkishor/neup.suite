
'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import { Receipt } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

type Invoice = {
    id: string;
    invoiceId: string;
    dueDate: string;
    status: 'Paid' | 'Due' | 'Overdue';
    amount: number;
    clientName: string;
}

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Paid': return 'default';
        case 'Due': return 'secondary';
        case 'Overdue': return 'destructive';
        default: return 'outline';
    }
}

function InvoiceCard({ invoice }: { invoice: Invoice }) {
    return (
        <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Invoice ID</p>
                        <p className="font-semibold">{invoice.invoiceId}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Client</p>
                        <p>{invoice.clientName}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm text-muted-foreground font-medium">Status</p>
                        <Badge variant={getStatusVariant(invoice.status)} className="w-fit">{invoice.status}</Badge>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Amount</p>
                        <p className="font-semibold">${invoice.amount.toFixed(2)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <p className="text-sm text-muted-foreground">Due: {format(new Date(invoice.dueDate), 'PPP')}</p>
                </div>
            </CardContent>
        </Card>
    )
}

function InvoiceCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                    <div className="space-y-1"><Skeleton className="h-4 w-16" /><Skeleton className="h-5 w-24" /></div>
                    <div className="space-y-1"><Skeleton className="h-4 w-12" /><Skeleton className="h-5 w-32" /></div>
                    <div className="space-y-1"><Skeleton className="h-4 w-14" /><Skeleton className="h-6 w-20" /></div>
                    <div className="space-y-1"><Skeleton className="h-4 w-14" /><Skeleton className="h-5 w-28" /></div>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-24" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function BillingPage() {
    const firestore = useFirestore();

    const invoicesCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'invoices') as CollectionReference<Invoice>;
    }, [firestore]);

    const { data: invoices, loading } = useCollection<Invoice>(invoicesCollection);

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
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
      <div className="space-y-4">
        {loading && Array.from({ length: 3 }).map((_, i) => <InvoiceCardSkeleton key={i} />)}
        {!loading && invoices?.map((invoice) => (
            <Link href={`/billing/${invoice.id}`} key={invoice.id}>
                <InvoiceCard invoice={invoice} />
            </Link>
        ))}
        {!loading && invoices?.length === 0 && (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No invoices found. Create one to get started.
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
