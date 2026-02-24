
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
import { addFeedback } from '@/actions/feedback/add-feedback';
import { updateFeedback } from '@/actions/feedback/update-feedback';
import { feedbackSchema } from '@/schemas/feedback';

type Feedback = z.infer<typeof feedbackSchema> & { id?: string };

export function FeedbackForm({ feedback, clientId }: { feedback?: Feedback, clientId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: feedback || {
      title: '',
      comment: '',
      clientId: clientId,
    },
  });

  useEffect(() => {
    if (feedback) {
        form.reset(feedback);
    } else {
        form.reset({
            title: '',
            comment: '',
            clientId: clientId,
        });
    }
  }, [feedback, clientId, form])

  async function onSubmit(values: z.infer<typeof feedbackSchema>) {
    setIsSubmitting(true);

    try {
      if (feedback?.id) {
        await updateFeedback(feedback.id, values);
      } else {
        await addFeedback(values);
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
        
        <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {feedback?.id ? 'Update Feedback' : 'Submit Feedback'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
