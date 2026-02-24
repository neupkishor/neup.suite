
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AddItemCard } from "@/components/add-item-card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { Discussion } from "@/generated/prisma";

function DiscussionCard({ discussion }: { discussion: Discussion }) {
    return (
        <Card>
            <CardContent className="p-4">
                <Link href={`/discussions/${discussion.id}`} className="font-semibold text-lg hover:underline">{discussion.title}</Link>
                <p className="text-sm text-muted-foreground">Created on: {discussion.createdAt.toLocaleDateString()}</p>
            </CardContent>
        </Card>
    )
}

export default async function DiscussionsPage() {
    const cookieStore = await cookies();
    const clientId = cookieStore.get('client')?.value;

    const discussions = clientId ? await prisma.discussion.findMany({
        where: {
            clientId: clientId
        },
        orderBy: {
            createdAt: 'desc'
        }
    }) : [];

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Discussions</CardTitle>
                <CardDescription>
                Start and participate in discussion threads.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
       {!clientId ? (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">Please select a client to manage their discussions.</p>
                    <Button asChild><Link href="/clients">Select Client</Link></Button>
                </CardContent>
            </Card>
        ) : (
      <div className="grid grid-cols-1 gap-4">
        <AddItemCard
            title="New Discussion"
            href="/discussions/add"
            icon={MessageCircle}
        />
        {discussions.map((item: Discussion) => <DiscussionCard key={item.id} discussion={item} />)}
          {discussions.length === 0 && (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No discussions found for this client.
                </CardContent>
            </Card>
          )}
      </div>
      )}
    </div>
  );
}
