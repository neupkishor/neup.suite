
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderImages } from "@/lib/placeholder-images";

export function KeyContacts() {
    const contacts = [
        { name: "Alex Ray", role: "Project Manager", avatarId: "contact-1" },
        { name: "Jordan Smith", role: "Lead Developer", avatarId: "contact-2" },
        { name: "Taylor Moore", role: "UX Designer", avatarId: "contact-3" },
        { name: "Casey Williams", role: "Account Executive", avatarId: "contact-4" },
    ];
  
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Key Contacts</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {contacts.map((contact) => {
            const avatar = placeholderImages.find(p => p.id === contact.avatarId);
            return (
              <div key={contact.name} className="flex flex-col items-center gap-2 text-center">
                <Avatar className="h-16 w-16">
                  {avatar && <AvatarImage src={avatar.imageUrl} alt={contact.name} data-ai-hint={avatar.imageHint} />}
                  <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.role}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
}
