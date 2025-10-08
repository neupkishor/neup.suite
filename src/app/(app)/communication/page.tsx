import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { placeholderImages } from "@/lib/placeholder-images";
import { Paperclip, Search, Send } from "lucide-react";

export default function CommunicationPage() {
    const contacts = [
        { name: "Alex Ray", role: "Project Phoenix", lastMessage: "Sounds good, I'll review it by EOD.", avatarId: 'contact-1', unread: 2 },
        { name: "Taylor Moore", role: "UX/UI Feedback", lastMessage: "Here are the latest mockups.", avatarId: 'contact-3', unread: 0 },
        { name: "Support Team", role: "Billing Question", lastMessage: "We've received your ticket...", avatarId: null, unread: 0 },
        { name: "Jordan Smith", role: "API Integration", lastMessage: "Can we schedule a call for tomorrow?", avatarId: 'contact-2', unread: 0 },
    ]
  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-1 md:grid-cols-3 lg:grid-cols-4 border-t">
        <div className="flex flex-col border-r bg-muted/20">
            <div className="p-4">
                <h2 className="font-headline text-2xl">Inbox</h2>
                <form className="relative mt-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-8" />
                </form>
            </div>
            <div className="flex-1 overflow-auto">
                <nav className="flex flex-col gap-1 p-2">
                    {contacts.map(contact => {
                        const avatar = placeholderImages.find(p => p.id === contact.avatarId);
                        return (
                            <button key={contact.name} className="flex items-start gap-3 rounded-lg p-3 text-left transition-all hover:bg-card">
                                <Avatar className="h-10 w-10 border">
                                    {avatar && <AvatarImage src={avatar.imageUrl} alt={contact.name} />}
                                    <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">{contact.name}</p>
                                        {contact.unread > 0 && <Badge className="h-5 w-5 justify-center p-0">{contact.unread}</Badge>}
                                    </div>
                                    <p className="text-xs font-medium text-muted-foreground">{contact.role}</p>
                                    <p className="truncate text-xs text-muted-foreground">{contact.lastMessage}</p>
                                </div>
                            </button>
                        )
                    })}
                </nav>
            </div>
        </div>
        <div className="flex flex-col md:col-span-2 lg:col-span-3">
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <h3 className="font-headline text-2xl">Select a conversation</h3>
                <p className="text-muted-foreground">Choose from your existing conversations to start chatting.</p>
            </div>
        </div>
    </div>
  );
}
