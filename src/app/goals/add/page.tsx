import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalForm } from '@/app/goals/components/goal-form';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export default async function AddGoalPage() {
    const cookieStore = await cookies();
    const clientId = cookieStore.get('client')?.value;

    let clientExists = false;
    if (clientId) {
        const client = await prisma.client.findUnique({
            where: { id: clientId }
        });
        if (client) {
            clientExists = true;
        }
    }

    if (!clientId || !clientExists) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Client Not Selected</CardTitle>
                    <CardDescription>Please select a client before adding a new goal.</CardDescription>
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
        <CardTitle className="font-headline text-2xl">Add New Goal</CardTitle>
        <CardDescription>
          Define a new goal or milestone to track.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GoalForm clientId={clientId} />
      </CardContent>
    </Card>
  );
}
