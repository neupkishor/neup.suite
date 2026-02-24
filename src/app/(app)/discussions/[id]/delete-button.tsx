'use client';

import { Button } from "@/components/ui/button";
import { deleteDiscussion } from '@/actions/discussions';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function DeleteDiscussionButton({ discussionId }: { discussionId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this discussion?')) {
            setIsDeleting(true);
            try {
                await deleteDiscussion(discussionId);
                router.push('/discussions');
            } catch (error) {
                console.error("Failed to delete discussion:", error);
                setIsDeleting(false);
                alert("Failed to delete discussion. Please try again.");
            }
        }
    }

    return (
        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
        </Button>
    );
}
