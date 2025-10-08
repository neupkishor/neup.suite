import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { placeholderImages } from "@/lib/placeholder-images";
import { UserPlus } from "lucide-react";

export default function TeamPage() {
    const teamMembers = [
        { name: 'Jane Doe', email: 'jane.doe@example.com', role: 'Admin', status: 'Active', avatarId: 'user-avatar' },
        { name: 'Alex Ray', email: 'alex.ray@neupsuite.com', role: 'Project Manager', status: 'Active', avatarId: 'contact-1' },
        { name: 'Jordan Smith', email: 'jordan.smith@neupsuite.com', role: 'Developer', status: 'Active', avatarId: 'contact-2' },
        { name: 'Casey Williams', email: 'casey.williams@neupsuite.com', role: 'Account Executive', status: 'Invited', avatarId: 'contact-4' },
    ];
    
    const getStatusVariant = (status: string) => {
        return status === 'Active' ? 'default' : 'secondary';
    };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline text-2xl">Team Members</CardTitle>
                <CardDescription>Manage who has access to this workspace.</CardDescription>
            </div>
            <Button>
                <UserPlus className="mr-2 h-4 w-4"/>
                Invite Member
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {teamMembers.map((member) => {
                    const avatar = placeholderImages.find(p => p.id === member.avatarId);
                    return (
                        <TableRow key={member.email}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        {avatar && <AvatarImage src={avatar.imageUrl} alt={member.name} />}
                                        <AvatarFallback>{member.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{member.name}</p>
                                        <p className="text-sm text-muted-foreground">{member.email}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{member.role}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(member.status)}>{member.status}</Badge>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
