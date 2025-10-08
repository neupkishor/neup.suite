
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
import { useFirestore } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { addReport } from '../actions/add-report';
import { updateReport } from '../actions/update-report';
import { reportSchema } from '@/schemas/report';

type Report = z.infer<typeof reportSchema> & { id?: string };

export function ReportForm({ report }: { report?: Report }) {
  const firestore = useFirestore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: report || {
      title: '',
      summary: '',
    },
  });

  async function onSubmit(values: z.infer<typeof reportSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);

    try {
      if (report?.id) {
        await updateReport(firestore, report.id, values);
      } else {
        await addReport(firestore, values);
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
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea placeholder="Provide a summary of the report..." {...field} />
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
