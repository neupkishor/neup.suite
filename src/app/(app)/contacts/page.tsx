
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Contact } from "@/schemas/contact";
import { ContactCard } from "./components/contact-card";

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

    const contactsCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'contacts') as CollectionReference<Contact>;
    }, [firestore]);

    const { data: contacts, loading } = useCollection<Contact & {id:string}>(contactsCollection);

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline text-2xl">Contacts</CardTitle>
                <CardDescription>Manage your team and client contacts.</CardDescription>
            </div>
            <Button asChild>
                <Link href="/contacts/add">
                    <UserPlus className="mr-2 h-4 w-4"/>
                    New Contact
                </Link>
            </Button>
        </div>
      </CardHeader>
      <div className="space-y-4">
        {loading && Array.from({ length: 4 }).map((_, i) => <ContactCardSkeleton key={i} />)}
        {!loading && contacts?.map((contact) => (
            <ContactCard contact={contact} key={contact.id} />
        ))}
        {!loading && contacts?.length === 0 && (
            <Card>
                <CardContent className="text-center p-8 text-muted-foreground">
                    No contacts found.
                </CardContent>
            </Card>
         )}
      </div>
    </div>
  );
}
