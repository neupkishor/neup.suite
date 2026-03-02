
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ContactForm } from '@/app/contacts/components/contact-form';
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AddContactPage() {
    const [clientId, setClientId] = useState<string|null>(null);

    useEffect(() => {
        setClientId(Cookies.get('client') || null);
    }, []);

    if (!clientId) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Client Not Selected</CardTitle>
                    <CardDescription>Please select a client before adding a new contact.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/clients">Select a Client</Link>
                    </Button>
                </CardContent>
            </Card>
        )
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
        <ContactForm clientId={clientId} />
      </CardContent>
    </Card>
  );
}
