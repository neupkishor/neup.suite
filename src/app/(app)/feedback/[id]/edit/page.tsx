
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackForm } from '@/app/(app)/feedback/components/feedback-form';
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditFeedbackPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const feedback = await prisma.feedback.findUnique({
        where: { id },
    });

    if (!feedback) {
        return notFound();
    }

    const feedbackData = {
        id: feedback.id,
        title: feedback.title,
        comment: feedback.comment,
        clientId: feedback.clientId,
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Edit Feedback</CardTitle>
                <CardDescription>
                    Update your feedback or comment.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FeedbackForm feedback={feedbackData} clientId={feedback.clientId} />
            </CardContent>
        </Card>
    );
}
