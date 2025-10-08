
'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import { UserPlus, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Contact } from "@/schemas/contact";


function ContactCard({ contact }: { contact: Contact & {id: string} }) {
    return (
        <Card>
            <CardContent className="p-4">
                <Link href={`/contacts/${contact.id}`} className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        {contact.avatarUrl && <AvatarImage src={contact.avatarUrl} alt={contact.name.displayName} />}
                        <AvatarFallback>{contact.name.displayName ? contact.name.displayName.split(' ').map(n=>n[0]).join('') : "NA"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-semibold text-lg hover:underline">{contact.name.displayName}</p>
                        <p className="text-sm text-muted-foreground">{contact.role}</p>
                        <div className="flex items-center gap-4 mt-1">
                            {contact.emails?.[0] && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    <span>{contact.emails[0].email}</span>
                                </div>
                            )}
                            {contact.phoneNumbers?.[0] && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    <span>{contact.phoneNumbers[0].phone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            </CardContent>
        </Card>
    )
}

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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading && Array.from({ length: 4 }).map((_, i) => <ContactCardSkeleton key={i} />)}
        {!loading && contacts?.map((contact) => (
            <ContactCard contact={contact} key={contact.id} />
        ))}
        {!loading && contacts?.length === 0 && (
            <Card className="md:col-span-2 xl:col-span-3">
                <CardContent className="text-center p-8 text-muted-foreground">
                    No contacts found.
                </CardContent>
            </Card>
         )}
      </div>
    </div>
  );
}

    