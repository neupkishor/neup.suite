
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useFirestore } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, use } from 'react';
import Link from 'next/link';
import { invoiceSchema } from '@/schemas/invoice';
import { updateInvoice } from '@/actions/billing/update-invoice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDoc } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

type Invoice = {
    id: string;
    invoiceId: string;
    amount: number;
    dueDate: string;
    status: 'Paid' | 'Due' | 'Overdue';
    clientName: string;
}

export default function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const firestore = useFirestore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const invoiceRef = useMemo(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'invoices', id) as DocumentReference<Invoice>;
  }, [firestore, id]);

  const { data: invoice, loading } = useDoc<Invoice>(invoiceRef);

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
  });

  useEffect(() => {
    if (invoice) {
      form.reset({
        ...invoice,
        dueDate: new Date(invoice.dueDate),
      });
    }
  }, [invoice, form]);

  async function onSubmit(values: z.infer<typeof invoiceSchema>) {
    if (!firestore || !id) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await updateInvoice(firestore, id, {
        ...values,
        dueDate: format(values.dueDate, 'yyyy-MM-dd'),
      });
      router.push('/billing');
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  }

  if (loading) {
    return <Card>
        <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-8 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
            </div>
            <Skeleton className="h-10" />
            <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
            </div>
        </CardContent>
    </Card>
  }
  
  if (!invoice && !loading) {
    return <Card>
        <CardHeader>
            <CardTitle>Invoice not found</CardTitle>
        </CardHeader>
        <CardContent>
            <p>The requested invoice could not be found.</p>
            <Button asChild className="mt-4"><Link href="/billing">Go Back</Link></Button>
        </CardContent>
    </Card>
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Edit Invoice: {invoice?.invoiceId}
        </CardTitle>
        <CardDescription>
          Update the details for this invoice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="invoiceId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Invoice ID</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. INV-2024-001" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Amount ($)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g. 1500" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={'outline'}
                            className={cn(
                                'pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                            )}
                            >
                            {field.value ? (
                                format(field.value, 'PPP')
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Due">Due</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Invoice
              </Button>
              <Button variant="outline" asChild>
                <Link href="/billing">Cancel</Link>
              </Button>
            </div>
            {submitError && (
              <p className="text-sm font-medium text-destructive">
                {submitError}
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
