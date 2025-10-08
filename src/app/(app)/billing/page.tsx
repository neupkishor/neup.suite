import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Receipt } from "lucide-react";

export default function BillingPage() {
    const invoices = [
        { id: 'INV-2024-005', dueDate: '2024-08-01', status: 'Paid', amount: '$1,500.00' },
        { id: 'INV-2024-004', dueDate: '2024-07-15', status: 'Due', amount: '$2,500.00' },
        { id: 'INV-2024-003', dueDate: '2024-07-01', status: 'Paid', amount: '$1,500.00' },
        { id: 'INV-2024-002', dueDate: '2024-06-01', status: 'Paid', amount: '$1,500.00' },
        { id: 'INV-2024-001', dueDate: '2024-05-15', status: 'Overdue', amount: '$500.00' },
    ];

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
            <Button variant="outline">
                <Receipt />
                Payment Methods
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge>
                        </TableCell>
                        <TableCell>{invoice.amount}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                {invoice.status === 'Due' && <Button size="sm">Pay Now</Button>}
                                <Button variant="outline" size="icon">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
