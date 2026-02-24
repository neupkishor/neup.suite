
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DeleteDiscussionButton } from "./delete-button";

export default async function DiscussionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const discussion = await prisma.discussion.findUnique({
        where: { id },
    });

    if (!discussion) {
        return notFound();
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-2xl">{discussion.title}</CardTitle>
                        <CardDescription>
                            Created on {discussion.createdAt.toLocaleDateString()}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href={`/discussions/${id}/edit`}>Edit</Link>
                        </Button>
                        <DeleteDiscussionButton discussionId={id} />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p>Discussion content will go here.</p>
            </CardContent>
        </Card>
    );
}
