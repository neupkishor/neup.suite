
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ContactForm } from "../components/contact-form";

export default function AddContactPage() {
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
        <ContactForm />
      </CardContent>
    </Card>
  );
}

    