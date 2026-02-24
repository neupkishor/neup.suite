
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DiscussionForm } from '@/app/(app)/discussions/components/discussion-form';
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditDiscussionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const discussion = await prisma.discussion.findUnique({
        where: { id },
    });

    if (!discussion) {
        return notFound();
    }

    const discussionData = {
        id: discussion.id,
        title: discussion.title,
        clientId: discussion.clientId || undefined,
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Edit Discussion</CardTitle>
                <CardDescription>
                    Update the title of this discussion.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DiscussionForm discussion={discussionData} clientId={discussion.clientId} />
            </CardContent>
        </Card>
    );
}
