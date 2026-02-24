
'use client';
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference, query, where } from "firebase/firestore";
import { UserPlus } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Contact } from "@/schemas/contact";
import { ContactCard } from "./components/contact-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AddItemCard } from "@/components/add-item-card";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ContactCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-4 flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-48" />
                </div>
            </CardContent>
        </Card>
    )
}


export default function ContactsPage() {
    const firestore = useFirestore();
    const [clientId, setClientId] = useState<string|null>(null);

    useEffect(() => {
        setClientId(Cookies.get('client') || null);
    }, []);

    const contactsCollection = useMemo(() => {
        if (!firestore || !clientId) return null;
        return query(collection(firestore, 'contacts') as CollectionReference<Contact>, where('clientId', '==', clientId));
    }, [firestore, clientId]);

    const { data: contacts, loading } = useCollection<Contact & {id:string}>(contactsCollection);

    if (!clientId) {
        return <div className="space-y-6">
            <CardHeader className="p-0">
                <CardTitle className="font-headline text-2xl">Contacts</CardTitle>
                <CardDescription>You need to select a client to see their contacts.</CardDescription>
            </CardHeader>
             <Card>
                <CardContent className="p-6 text-center">
                    <Button asChild><Link href="/clients">Select Client</Link></Button>
                </CardContent>
            </Card>
        </div>
    }

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline text-2xl">Contacts</CardTitle>
                <CardDescription>Manage your team and client contacts.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <div className="grid grid-cols-1 gap-4">
        {!loading && (
            <AddItemCard
                title="New Contact"
                href="/contacts/add"
                icon={UserPlus}
            />
        )}
        {loading && Array.from({ length: 4 }).map((_, i) => <ContactCardSkeleton key={i} />)}
        {!loading && contacts?.map((contact) => (
            <ContactCard contact={contact} key={contact.id} />
        ))}
        {!loading && contacts?.length === 0 && (
            <Card>
                <CardContent className="text-center p-8 text-muted-foreground">
                    No contacts found for this client.
                </CardContent>
            </Card>
         )}
      </div>
    </div>
  );
}
