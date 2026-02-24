import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Mail, Phone, Globe, Trash2, Pencil, Calendar, MessageSquare, Briefcase, MapPin, Notebook, Building } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DeleteContactButton } from "./delete-button";
import { notFound } from "next/navigation";
import { Contact } from "@/generated/prisma";

const getDisplayName = (contact: Contact) => {
    return [contact.firstName, contact.middleName, contact.lastName].filter(Boolean).join(' ') || 'Unnamed Contact';
}

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
      return (
        <Card>
          <CardHeader><CardTitle>Contact not found</CardTitle></CardHeader>
          <CardContent>
            <p>The requested contact could not be found.</p>
            <Button asChild className="mt-4"><Link href="/contacts">Go Back</Link></Button>
          </CardContent>
      </Card>
      );
  }

  const displayName = getDisplayName(contact);
  
  // Parse JSON fields
  const emails = (contact.emails as any[]) || [];
  const phoneNumbers = (contact.phoneNumbers as any[]) || [];
  const addresses = (contact.addresses as any[]) || [];
  const socialProfiles = (contact.socialProfiles as any[]) || [];
  const messaging = (contact.messaging as any[]) || [];
  const importantDates = (contact.importantDates as any[]) || [];

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
                     <Button asChild variant="outline">
                        <Link href={`/contacts/${id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit</Link>
                    </Button>
                    <DeleteContactButton contactId={contact.id} />
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Contact Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><Phone className="h-5 w-5" /> Contact Details</h3>
                    <div className="space-y-3">
                        {emails.length > 0 && (
                            <div className="space-y-1">
                                {emails.map((email: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <a href={`mailto:${email.email}`} className="hover:underline">{email.email}</a>
                                        {email.label && <Badge variant="secondary" className="text-xs">{email.label}</Badge>}
                                    </div>
                                ))}
                            </div>
                        )}
                         {phoneNumbers.length > 0 && (
                            <div className="space-y-1">
                                {phoneNumbers.map((phone: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <a href={`tel:${phone.phone}`} className="hover:underline">{phone.phone}</a>
                                        {phone.label && <Badge variant="secondary" className="text-xs">{phone.label}</Badge>}
                                    </div>
                                ))}
                            </div>
                        )}
                        {messaging.length > 0 && (
                             <div className="space-y-1">
                                {messaging.map((msg: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                        <span>{msg.address}</span>
                                        {msg.label && <Badge variant="secondary" className="text-xs">{msg.label}</Badge>}
                                    </div>
                                ))}
                            </div>
                        )}
                         {socialProfiles.length > 0 && (
                             <div className="space-y-1">
                                {socialProfiles.map((profile: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <a href={profile.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{profile.url}</a>
                                        {profile.label && <Badge variant="secondary" className="text-xs">{profile.label}</Badge>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Address & Dates */}
                <div className="space-y-4">
                     <h3 className="text-lg font-semibold flex items-center gap-2"><MapPin className="h-5 w-5" /> Locations & Dates</h3>
                     <div className="space-y-3">
                        {addresses.length > 0 && (
                             <div className="space-y-2">
                                {addresses.map((addr: any, idx: number) => (
                                    <div key={idx} className="text-sm border-l-2 border-muted pl-3">
                                        <div className="font-medium flex items-center gap-2">
                                            {addr.label || 'Address'}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {addr.street && <div>{addr.street}</div>}
                                            <div>
                                                {[addr.city, addr.state, addr.zip].filter(Boolean).join(', ')}
                                            </div>
                                            {addr.country && <div>{addr.country}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {importantDates.length > 0 && (
                             <div className="space-y-1">
                                {importantDates.map((date: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>{format(new Date(date.date), 'PPP')}</span>
                                        {date.label && <Badge variant="secondary" className="text-xs">{date.label}</Badge>}
                                    </div>
                                ))}
                            </div>
                        )}
                     </div>
                </div>

            </div>

             {/* Notes */}
            {contact.notes && (
                <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><Notebook className="h-5 w-5" /> Notes</h3>
                    <p className="whitespace-pre-wrap text-sm">{contact.notes}</p>
                </div>
            )}
        </CardContent>
        </Card>
    </div>
  );
}
