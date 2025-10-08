
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
import { useRouter } from "next/navigation";
import { deleteContact } from "@/actions/contacts/delete-contact";
import { Loader2, Mail, Phone, Globe, Trash2, Pencil, Calendar, MessageSquare, Briefcase, MapPin, Notebook, Plus, User as UserIcon, Building } from "lucide-react";
import type { Contact } from "@/schemas/contact";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const getDisplayName = (name: Contact['name'] = {}) => {
    return [name.firstName, name.middleName, name.lastName].filter(Boolean).join(' ') || 'Unnamed Contact';
}

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const contactRef = useMemo(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'contacts', params.id) as DocumentReference<Contact>;
  }, [firestore, params.id]);

  const { data: contact, loading } = useDoc<Contact>(contactRef);

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
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-32" />
                </div>
             </div>
          </CardHeader>
          <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full mt-2" />
              <Skeleton className="h-20 w-full mt-2" />
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

  const displayName = getDisplayName(contact.name);
  const hasNameDetails = contact.name.firstName || contact.name.middleName || contact.name.lastName;


  return (
    <div className="space-y-6">
        <Card>
        <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                        {contact.avatarUrl && <AvatarImage src={contact.avatarUrl} alt={displayName} />}
                        <AvatarFallback className="text-4xl">{displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="font-headline text-3xl">{displayName}</CardTitle>
                        {contact.role && <p className="text-base text-muted-foreground">{contact.role}</p>}
                        {contact.organization && <p className="text-sm text-muted-foreground flex items-center gap-2"><Building className="h-4 w-4" />{contact.organization}</p>}
                    </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    <Button asChild>
                        <Link href={`/contacts/${params.id}/edit`}><Pencil />Edit</Link>
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting && <Loader2 className="animate-spin" />}
                        <Trash2 /> Delete
                    </Button>
                </div>
            </div>
        </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                {hasNameDetails && (
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><UserIcon /> Name Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><p className="text-sm text-muted-foreground">First Name</p><p>{contact.name.firstName || '-'}</p></div>
                            <div><p className="text-sm text-muted-foreground">Middle Name</p><p>{contact.name.middleName || '-'}</p></div>
                            <div><p className="text-sm text-muted-foreground">Last Name</p><p>{contact.name.lastName || '-'}</p></div>
                        </CardContent>
                    </Card>
                )}

                 {/* Notes */}
                {contact.notes && <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Notebook /> Notes</CardTitle></CardHeader>
                    <CardContent><p className="whitespace-pre-wrap">{contact.notes}</p></CardContent>
                </Card>}
            </div>

            <div className="space-y-6">
                {/* Contact Info */}
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Briefcase/> Contact Info</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {contact.emails?.map((item, i) => item.email && (
                            <div key={i} className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground"/>
                                <a href={`mailto:${item.email}`} className="text-primary hover:underline">{item.email}</a>
                                {item.label && <Badge variant="secondary">{item.label}</Badge>}
                            </div>
                        ))}
                        {contact.phoneNumbers?.map((item, i) => item.phone && (
                            <div key={i} className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground"/>
                                <span>{item.phone}</span>
                                {item.label && <Badge variant="secondary">{item.label}</Badge>}
                            </div>
                        ))}
                         {(!contact.emails || contact.emails.every(e => !e.email)) && (!contact.phoneNumbers || contact.phoneNumbers.every(p => !p.phone)) && (
                            <p className="text-sm text-muted-foreground">No contact information provided.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Address */}
                {contact.addresses && contact.addresses.length > 0 && <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><MapPin /> Addresses</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {contact.addresses.map((addr, i) => (
                            <div key={i} className="text-sm">
                                <p className="font-semibold">{addr.label}</p>
                                <p>{addr.street}</p>
                                <p>{addr.city}, {addr.state} {addr.zip}</p>
                                <p>{addr.country}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>}
                
                {/* Social Profiles */}
                {contact.socialProfiles && contact.socialProfiles.length > 0 && <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Globe /> Social Profiles</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {contact.socialProfiles.map((social, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                                <Globe className="h-4 w-4 text-muted-foreground"/>
                                <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{social.label}</a>
                            </div>
                        ))}
                    </CardContent>
                </Card>}

                {/* Messaging */}
                {contact.messaging && contact.messaging.length > 0 && <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><MessageSquare /> Messaging</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {contact.messaging.map((msg, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                                <MessageSquare className="h-4 w-4 text-muted-foreground"/>
                                <span>{msg.address}</span>
                                <Badge variant="secondary">{msg.label}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>}

                 {/* Important Dates */}
                {contact.importantDates && contact.importantDates.length > 0 && <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Calendar /> Important Dates</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {contact.importantDates.map((d, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground"/>
                                <span>{format(new Date(d.date), 'PPP')}</span>
                                <Badge variant="secondary">{d.label}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>}
            </div>
        </div>
    </div>
  );
}

    
