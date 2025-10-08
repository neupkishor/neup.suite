
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
import { Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { addDiscussion } from '../actions/add-discussion';
import { updateDiscussion } from '../actions/update-discussion';
import { discussionSchema } from '@/schemas/discussion';

type Discussion = z.infer<typeof discussionSchema> & { id?: string };

export function DiscussionForm({ discussion }: { discussion?: Discussion }) {
  const firestore = useFirestore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof discussionSchema>>({
    resolver: zodResolver(discussionSchema),
    defaultValues: discussion || {
      title: '',
    },
  });

  async function onSubmit(values: z.infer<typeof discussionSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);

    try {
      if (discussion?.id) {
        await updateDiscussion(firestore, discussion.id, values);
      } else {
        await addDiscussion(firestore, {...values, createdBy: 'Jane Doe'});
      }
      router.push('/discussions');
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
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input placeholder="What is this discussion about?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {discussion ? 'Update Discussion' : 'Start Discussion'}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/discussions">Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
