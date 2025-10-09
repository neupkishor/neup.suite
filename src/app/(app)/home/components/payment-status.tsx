
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Receipt } from "lucide-react";
import type { Invoice } from "@/schemas/invoice";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInDays } from "date-fns";
import Link from "next/link";

const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    NRS: 'रु',
};

export function PaymentStatus({ invoices }: { invoices: Invoice[] | null }) {
    if (!invoices) {
        return <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl">Billing</CardTitle>
                <Skeleton className="h-4 w-32 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    }
  
    const nextDueInvoice = invoices
        .filter(inv => inv.status === 'Due' || inv.status === 'Overdue')
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

    const description = nextDueInvoice 
        ? `Next invoice due in ${differenceInDays(new Date(nextDueInvoice.dueDate), new Date())} days.` 
        : 'All invoices are paid up.';
    
    const currencySymbol = nextDueInvoice ? (currencySymbols[nextDueInvoice.currency as keyof typeof currencySymbols] || '$') : '$';


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Billing</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {nextDueInvoice ? (
            <div className="flex items-center justify-between rounded-lg border bg-card-foreground/5 p-4">
                <div>
                    <p className="text-sm text-muted-foreground">Next payment</p>
                    <p className="text-2xl font-bold font-headline">{currencySymbol} {nextDueInvoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <DollarSign className="h-6 w-6" />
                </div>
            </div>
        ) : (
             <div className="flex items-center justify-center rounded-lg border bg-card-foreground/5 p-4 text-center">
                 <p className="text-muted-foreground">No outstanding payments.</p>
             </div>
        )}
        <div className="flex gap-2">
            <Button className="flex-1" disabled={!nextDueInvoice}>Pay Now</Button>
            <Button variant="outline" className="flex-1" asChild>
                <Link href="/billing"><Receipt className="mr-2 h-4 w-4"/> View Invoices</Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
