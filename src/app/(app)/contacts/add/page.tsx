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
import { Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { contactSchema } from '@/schemas/contact';
import { addContact } from '@/actions/contacts/add-contact';

export default function AddContactPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
    },
  });

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await addContact(firestore, values);
      router.push('/contacts');
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Create New Contact
        </CardTitle>
        <CardDescription>
          Fill out the details below to add a new contact.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. jane.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Project Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Contact
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contacts">Cancel</Link>
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
