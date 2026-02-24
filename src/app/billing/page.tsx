
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference, query, where } from "firebase/firestore";
import { Receipt } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { InvoiceCard } from "./components/invoice-card";
import { AddItemCard } from "@/components/add-item-card";
import Cookies from "js-cookie";

type Invoice = {
    id: string;
    invoiceId: string;
    title: string;
    dueDate: string;
    status: 'Paid' | 'Due' | 'Overdue';
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'NRS';
    clientName: string;
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
    const [clientId, setClientId] = useState<string|null>(null);

    useEffect(() => {
        setClientId(Cookies.get('client') || null);
    }, []);

    const invoicesCollection = useMemo(() => {
        if (!firestore) return null;
        let q = collection(firestore, 'invoices') as CollectionReference<Invoice>;
        if (clientId) {
            return query(q, where('clientId', '==', clientId));
        }
        return query(q);
    }, [firestore, clientId]);

    const { data: invoices, loading } = useCollection<Invoice>(invoicesCollection);

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline text-2xl">Billing & Invoices</CardTitle>
                <CardDescription>
                    {clientId ? "View payment history and download invoices for the selected client." : "View payment history and download invoices for all clients."}
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <div className="grid grid-cols-1 gap-4">
        {clientId && !loading && (
            <AddItemCard 
                title="New Invoice" 
                href="/billing/add" 
                icon={Receipt}
            />
        )}
        {loading && Array.from({ length: 3 }).map((_, i) => <InvoiceCardSkeleton key={i} />)}
        {!loading && invoices?.map((invoice) => (
            <Link href={`/billing/${invoice.id}`} key={invoice.id}>
                <InvoiceCard invoice={invoice} />
            </Link>
        ))}
        {!loading && invoices?.length === 0 && (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No invoices found.
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
