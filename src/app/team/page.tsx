
'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderImages } from "@/lib/placeholder-images";
import { UserPlus } from "lucide-react";
import { AddItemCard } from "@/components/add-item-card";

const teamMembers = [
    { name: 'Jane Doe', email: 'jane.doe@example.com', role: 'Admin', status: 'Active', avatarId: 'user-avatar' },
    { name: 'Alex Ray', email: 'alex.ray@neupsuite.com', role: 'Project Manager', status: 'Active', avatarId: 'contact-1' },
    { name: 'Jordan Smith', email: 'jordan.smith@neupsuite.com', role: 'Developer', status: 'Active', avatarId: 'contact-2' },
    { name: 'Casey Williams', email: 'casey.williams@neupsuite.com', role: 'Account Executive', status: 'Invited', avatarId: 'contact-4' },
];

const getStatusVariant = (status: string) => {
    return status === 'Active' ? 'default' : 'secondary';
};

function TeamMemberCard({ member }: { member: typeof teamMembers[0] }) {
    const avatar = placeholderImages.find(p => p.id === member.avatarId);
    return (
        <Card>
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        {avatar && <AvatarImage src={avatar.imageUrl} alt={member.name} />}
                        <AvatarFallback>{member.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-lg">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <p className="text-sm text-muted-foreground hidden sm:block">{member.role}</p>
                     <Badge variant={getStatusVariant(member.status)}>{member.status}</Badge>
                </div>
            </CardContent>
        </Card>
    )
}

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline text-2xl">Team Members</CardTitle>
                <CardDescription>Manage who has access to this workspace.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <div className="grid grid-cols-1 gap-4">
        <AddItemCard title="Invite Member" href="#" icon={UserPlus} />
        {teamMembers.map((member) => (
            <TeamMemberCard key={member.email} member={member} />
        ))}
      </div>
    </div>
  );
}
