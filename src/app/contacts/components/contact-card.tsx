
'use client';
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone } from "lucide-react";
import type { Contact } from "@/schemas/contact";

const getDisplayName = (name: Contact['name'] = {}) => {
    return [name.firstName, name.middleName, name.lastName].filter(Boolean).join(' ') || 'Unnamed Contact';
}

export function ContactCard({ contact }: { contact: Contact & {id: string} }) {
    const displayName = getDisplayName(contact.name);
    return (
        <Card>
            <CardContent className="p-4">
                <Link href={`/contacts/${contact.id}`} className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        {contact.avatarUrl && <AvatarImage src={contact.avatarUrl} alt={displayName} />}
                        <AvatarFallback>{displayName.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-semibold text-lg hover:underline">{displayName}</p>
                        <p className="text-sm text-muted-foreground">{contact.role}</p>
                        <div className="flex items-center gap-4 mt-1">
                            {contact.emails?.[0]?.email && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    <span>{contact.emails[0].email}</span>
                                </div>
                            )}
                            {contact.phoneNumbers?.[0]?.phone && (
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
