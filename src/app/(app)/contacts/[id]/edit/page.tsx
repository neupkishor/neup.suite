
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useFirestore } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useDoc } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { ContactForm } from '../../components/contact-form';
import type { Contact } from '@/schemas/contact';
import { Button } from '@/components/ui/button';

export default function EditContactPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();

  const contactRef = useMemo(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'contacts', params.id) as DocumentReference<Contact>;
  }, [firestore, params.id]);

  const { data: contact, loading } = useDoc<Contact & { id: string }>(contactRef);
  
  if (loading) {
    return <Card>
        <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-8 max-w-2xl mt-6">
            <Skeleton className="h-10" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
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
          Edit Contact: {contact?.name.displayName}
        </CardTitle>
        <CardDescription>
          Update the details for this contact.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ContactForm contact={contact} />
      </CardContent>
    </Card>
  );
}
