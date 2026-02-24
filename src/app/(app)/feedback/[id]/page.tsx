
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DeleteFeedbackButton } from "./delete-button";

export default async function FeedbackDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const feedback = await prisma.feedback.findUnique({
        where: { id },
    });

    if (!feedback) {
        return (
            <Card>
                <CardHeader><CardTitle>Feedback not found</CardTitle></CardHeader>
                <CardContent>
                    <p>The requested feedback could not be found.</p>
                    <Button asChild className="mt-4"><Link href="/feedback">Go back to feedback</Link></Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-2xl">{feedback.title}</CardTitle>
                        <CardDescription>
                            Submitted on {feedback.createdAt.toLocaleString()}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/feedback/${id}/edit`}>Edit</Link>
                        </Button>
                        <DeleteFeedbackButton feedbackId={feedback.id} />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-wrap">{feedback.comment}</p>
            </CardContent>
        </Card>
    );
}
