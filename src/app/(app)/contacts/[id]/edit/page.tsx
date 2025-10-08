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
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { contactSchema } from '@/schemas/contact';
import { updateContact } from '@/actions/contacts/update-contact';
import { useDoc } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

type Contact = z.infer<typeof contactSchema>;

export default function EditContactPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const contactRef = useMemo(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'contacts', params.id) as DocumentReference<Contact>;
  }, [firestore, params.id]);

  const { data: contact, loading } = useDoc<Contact>(contactRef);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    if (contact) {
      form.reset(contact);
    }
  }, [contact, form]);

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    if (!firestore || !params.id) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await updateContact(firestore, params.id, values);
      router.push('/contacts');
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
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
            </div>
        </CardContent>
    </Card>
  }
  
  if (!contact && !loading) {
    return <Card>
        <CardHeader>
            <CardTitle>Contact not found</CardTitle>
        </CardHeader>
        <CardContent>
            <p>The requested contact could not be found.</p>
            <Button asChild className="mt-4"><Link href="/contacts">Go Back</Link></Button>
        </CardContent>
    </Card>
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Edit Contact: {contact?.name}
        </CardTitle>
        <CardDescription>
          Update the details for this contact.
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
                Update Contact
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
