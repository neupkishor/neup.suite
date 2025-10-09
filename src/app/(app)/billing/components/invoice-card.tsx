
'use client';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
    dueDate: string;
    status: 'Paid' | 'Due' | 'Overdue';
    amount: number;
    currency: keyof typeof currencySymbols;
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

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
    const currencySymbol = currencySymbols[invoice.currency] || '$';
    return (
        <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Title</p>
                        <p className="font-semibold">{invoice.title}</p>
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
                        <p className="font-semibold">{currencySymbol}{invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <p className="text-sm text-muted-foreground">Due: {format(new Date(invoice.dueDate), 'PPP')}</p>
                </div>
            </CardContent>
        </Card>
    )
}
