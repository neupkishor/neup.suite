import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Receipt } from "lucide-react";

export function PaymentStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Billing</CardTitle>
        <CardDescription>Next invoice due in 5 days.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border bg-card-foreground/5 p-4">
          <div>
            <p className="text-sm text-muted-foreground">Next payment</p>
            <p className="text-2xl font-bold font-headline">$2,500.00</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
        <div className="flex gap-2">
            <Button className="flex-1">Pay Now</Button>
            <Button variant="outline" className="flex-1">
                <Receipt /> View Invoices
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
