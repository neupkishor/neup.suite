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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { invoiceSchema } from '@/schemas/invoice';
import { addInvoice } from '@/actions/billing/add-invoice';
import { updateInvoice } from '@/actions/billing/update-invoice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Invoice } from '@/generated/prisma';

const generateInvoiceId = (clientName: string = '') => {
    const brandName = 'NEUP';
    const clientPart = clientName.trim().replace(/\s+/g, '-').toLowerCase();
    const uniquePart = `${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    return `${brandName}-${clientPart || 'client'}-${uniquePart}`;
}

type InvoiceFormProps = {
    invoice?: Invoice;
    clientId?: string;
    clientName?: string;
};

export function InvoiceForm({ invoice, clientId, clientName }: InvoiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
        invoiceId: invoice?.invoiceId || generateInvoiceId(clientName),
        title: invoice?.title || '',
        description: invoice?.description || undefined,
        status: (invoice?.status as any) || 'Due',
        clientName: invoice?.clientName || clientName || '',
        amount: invoice?.amount || 0,
        currency: (invoice?.currency as any) || 'USD',
        clientId: invoice?.clientId || clientId || '',
        dueDate: invoice?.dueDate ? new Date(invoice.dueDate) : undefined,
    },
  });

  const watchedClientName = form.watch('clientName');

  useEffect(() => {
    if (clientName && !invoice) {
        form.setValue('clientName', clientName);
        form.setValue('invoiceId', generateInvoiceId(clientName));
    }
    if (clientId && !invoice) {
        form.setValue('clientId', clientId);
    }
  }, [clientName, clientId, invoice, form]);

  useEffect(() => {
    if (watchedClientName && !invoice) {
        // Only auto-generate ID if it's a new invoice
        form.setValue('invoiceId', generateInvoiceId(watchedClientName));
    }
  }, [watchedClientName, invoice, form]);

  async function onSubmit(values: z.infer<typeof invoiceSchema>) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (invoice) {
        await updateInvoice(invoice.id, {
            ...values,
            dueDate: format(values.dueDate, 'yyyy-MM-dd'),
        });
      } else {
        await addInvoice({
            ...values,
            dueDate: format(values.dueDate, 'yyyy-MM-dd'),
        });
      }
      router.push('/billing');
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          {invoice ? `Edit Invoice: ${invoice.invoiceId}` : 'Create New Invoice'}
        </CardTitle>
        <CardDescription>
          {invoice ? 'Update the details for this invoice.' : `Fill out the details below to create a new invoice${clientName ? ` for ${clientName}` : ''}.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
             <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Q3 Website Redesign" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
             <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                        <Textarea placeholder="e.g. Invoice for the third quarter website redesign project, including design and development phases." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Acme Inc." {...field} disabled={!!clientName} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="invoiceId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Invoice ID</FormLabel>
                    <FormControl>
                        <Input disabled {...field} />
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
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g. 1500" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="JPY">JPY</SelectItem>
                          <SelectItem value="NRS">NRS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                 <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
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
            </div>

            {submitError && (
              <div className="text-red-500 text-sm">{submitError}</div>
            )}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push('/billing')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {invoice ? 'Update Invoice' : 'Create Invoice'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
