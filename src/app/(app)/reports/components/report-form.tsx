
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
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { addReport, updateReport } from '@/actions/reports';
import { reportSchema } from '@/schemas/report';

type Report = z.infer<typeof reportSchema> & { id?: string };

export function ReportForm({ report, clientId }: { report?: Report, clientId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: report || {
      title: '',
      content: '',
      clientId: clientId,
    },
  });

   useEffect(() => {
    if (report) {
        form.reset(report);
    } else {
        form.reset({
            title: '',
            content: '',
            clientId: clientId,
        });
    }
  }, [report, clientId, form])


  async function onSubmit(values: z.infer<typeof reportSchema>) {
    setIsSubmitting(true);

    try {
      if (report?.id) {
        await updateReport(report.id, values);
      } else {
        await addReport(values);
      }
      router.push('/reports');
      router.refresh();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Q3 Performance Review" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (HTML)</FormLabel>
              <FormControl>
                <Textarea placeholder="<h1>Report Content</h1><p>Details...</p>" {...field} rows={15} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {report ? 'Update Report' : 'Create Report'}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/reports">Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
