
'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import { MoreHorizontal, UserPlus } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { placeholderImages } from "@/lib/placeholder-images";
import { deleteContact } from "@/actions/contacts/delete-contact";

type Contact = {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarId?: string;
}

function ContactCard({ contact, handleDelete }: { contact: Contact, handleDelete: (id: string) => void }) {
    const avatar = placeholderImages.find(p => p.id === contact.avatarId);
    return (
        <Card>
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        {avatar && <AvatarImage src={avatar.imageUrl} alt={contact.name} />}
                        <AvatarFallback>{contact.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-lg">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground hidden sm:block">{contact.role}</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                                <Link href={`/contacts/${contact.id}/edit`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(contact.id)} className="text-destructive">
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    )
}

function ContactCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-5 w-24 hidden sm:block" />
                    <Skeleton className="h-8 w-8" />
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

    const { data: contacts, loading } = useCollection<Contact>(contactsCollection);

    const handleDelete = async (id: string) => {
        if (!firestore) return;
        if (confirm('Are you sure you want to delete this contact?')) {
            try {
                await deleteContact(firestore, id);
            } catch (error) {
                console.error("Error deleting contact: ", error);
            }
        }
    }

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
            <ContactCard key={contact.id} contact={contact} handleDelete={handleDelete} />
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
