
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DiscussionForm } from '@/app/(app)/discussions/components/discussion-form';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function AddDiscussionPage() {
    const cookieStore = await cookies();
    const clientId = cookieStore.get('client')?.value;

    if (!clientId) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Client Not Selected</CardTitle>
                    <CardDescription>Please select a client before adding a new discussion.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/clients">Select a Client</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Start a New Discussion</CardTitle>
        <CardDescription>
          Create a new thread to start a conversation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DiscussionForm clientId={clientId} />
      </CardContent>
    </Card>
  );
}
