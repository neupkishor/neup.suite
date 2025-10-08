
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
import { addFeedback } from '../actions/add-feedback';
import { updateFeedback } from '../actions/update-feedback';
import { feedbackSchema } from '@/schemas/feedback';

type Feedback = z.infer<typeof feedbackSchema> & { id?: string };

export function FeedbackForm({ feedback }: { feedback?: Feedback }) {
  const firestore = useFirestore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: feedback || {
      title: '',
      comment: '',
    },
  });

  async function onSubmit(values: z.infer<typeof feedbackSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);

    try {
      if (feedback?.id) {
        await updateFeedback(firestore, feedback.id, values);
      } else {
        await addFeedback(firestore, {...values, submittedBy: 'Jane Doe'});
      }
      router.push('/feedback');
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
                <Input placeholder="e.g. Feedback on recent designs" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea placeholder="Share your detailed feedback..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {feedback ? 'Update Feedback' : 'Submit Feedback'}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/feedback">Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
