
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AddItemCard } from "@/components/add-item-card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { Megaphone } from "lucide-react";
import { Feedback } from "@/generated/prisma";

function FeedbackCard({ feedback }: { feedback: Feedback }) {
    return (
        <Card>
            <CardContent className="p-4">
                <Link href={`/feedback/${feedback.id}`} className="font-semibold text-lg hover:underline">{feedback.title}</Link>
                <p className="text-sm text-muted-foreground line-clamp-2">{feedback.comment}</p>
            </CardContent>
        </Card>
    )
}

export default async function FeedbackPage() {
    const cookieStore = await cookies();
    const clientId = cookieStore.get('client')?.value;

    const feedbackItems = clientId ? await prisma.feedback.findMany({
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
                <CardTitle className="font-headline text-2xl">Client Feedback</CardTitle>
                <CardDescription>
                Review comments and feedback from clients.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
       {!clientId ? (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">Please select a client to manage their feedback.</p>
                    <Button asChild><Link href="/clients">Select Client</Link></Button>
                </CardContent>
            </Card>
        ) : (
      <div className="grid grid-cols-1 gap-4">
        <AddItemCard
            title="New Feedback"
            href="/feedback/add"
            icon={Megaphone}
        />
        {feedbackItems.map((item: Feedback) => <FeedbackCard key={item.id} feedback={item} />)}
          {feedbackItems.length === 0 && (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No feedback found for this client.
                </CardContent>
            </Card>
        )}
      </div>
      )}
    </div>
  );
}
