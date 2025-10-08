'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <Card>
      <CardHeader>
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
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading && Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-1"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-48" /></div></div></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                ))}
                {!loading && contacts?.map((contact) => {
                    const avatar = placeholderImages.find(p => p.id === contact.avatarId);
                    return (
                    <TableRow key={contact.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    {avatar && <AvatarImage src={avatar.imageUrl} alt={contact.name} />}
                                    <AvatarFallback>{contact.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{contact.name}</p>
                                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>{contact.role}</TableCell>
                        <TableCell className="text-right">
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
                        </TableCell>
                    </TableRow>
                )})}
            </TableBody>
        </Table>
         {!loading && contacts?.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
                No contacts found.
            </div>
         )}
      </CardContent>
    </Card>
  );
}
