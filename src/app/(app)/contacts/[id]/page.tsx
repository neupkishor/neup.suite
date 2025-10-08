
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDoc } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { doc, DocumentReference } from "firebase/firestore";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { placeholderImages } from "@/lib/placeholder-images";
import { z } from "zod";
import { contactSchema } from "@/schemas/contact";
import { useRouter } from "next/navigation";
import { deleteContact } from "@/actions/contacts/delete-contact";
import { Loader2 } from "lucide-react";

type Contact = z.infer<typeof contactSchema> & { id: string };

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const contactRef = useMemo(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'contacts', params.id) as DocumentReference<Contact>;
  }, [firestore, params.id]);

  const { data: contact, loading } = useDoc<Contact>(contactRef);
  const avatar = placeholderImages.find(p => p.id === contact?.avatarId);

  const handleDelete = async () => {
    if (!firestore || !params.id) return;
    if (confirm('Are you sure you want to delete this contact?')) {
        setIsDeleting(true);
        try {
            await deleteContact(firestore, params.id);
            router.push('/contacts');
        } catch (error) {
            console.error("Error deleting contact: ", error);
            setIsDeleting(false);
        }
    }
  }


  if (loading) {
      return <Card>
          <CardHeader>
             <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-32" />
                </div>
             </div>
          </CardHeader>
          <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
          </CardContent>
      </Card>
  }

  if (!contact) {
      return <Card>
          <CardHeader><CardTitle>Contact not found</CardTitle></CardHeader>
          <CardContent>
            <p>The requested contact could not be found.</p>
            <Button asChild className="mt-4"><Link href="/contacts">Go Back</Link></Button>
          </CardContent>
      </Card>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    {avatar && <AvatarImage src={avatar.imageUrl} alt={contact.name} />}
                    <AvatarFallback className="text-3xl">{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="font-headline text-3xl">{contact.name}</CardTitle>
                    <CardDescription className="text-lg">{contact.role}</CardDescription>
                </div>
            </div>
            <div className="flex gap-2">
                <Button asChild>
                    <Link href={`/contacts/${params.id}/edit`}>Edit Contact</Link>
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>Email: <a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a></p>
      </CardContent>
    </Card>
  );
}
