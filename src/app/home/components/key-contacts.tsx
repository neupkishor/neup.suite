import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Contact } from "@/schemas/contact";
import { Skeleton } from "@/components/ui/skeleton";

const getDisplayName = (name: Contact['name'] = {}) => {
    return [name.firstName, name.middleName, name.lastName].filter(Boolean).join(' ') || 'Unnamed Contact';
}

export function KeyContacts({ contacts }: { contacts: (Contact & {id: string})[] | null }) {
    if (!contacts) {
        return <Card>
            <CardHeader><CardTitle className="font-headline text-xl">Key Contacts</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
            </CardContent>
        </Card>
    }

    // Display most recently added contacts
    const recentContacts = contacts.slice(0, 4);
  
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Key Contacts</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {recentContacts.length > 0 ? recentContacts.map((contact) => {
            const displayName = getDisplayName(contact.name);
            return (
              <div key={contact.id} className="flex flex-col items-center gap-2 text-center">
                <Avatar className="h-16 w-16">
                  {contact.avatarUrl && <AvatarImage src={contact.avatarUrl} alt={displayName} />}
                  <AvatarFallback>{displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{displayName}</p>
                  <p className="text-sm text-muted-foreground">{contact.role}</p>
                </div>
              </div>
            );
          }) : <p className="text-sm text-muted-foreground col-span-full">No contacts found.</p>}
        </CardContent>
      </Card>
    );
}
