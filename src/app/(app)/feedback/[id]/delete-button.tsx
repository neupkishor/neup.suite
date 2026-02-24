'use client';

import { Button } from "@/components/ui/button";
import { deleteFeedback } from "@/actions/feedback/delete-feedback";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function DeleteFeedbackButton({ feedbackId }: { feedbackId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
            setIsDeleting(true);
            try {
                await deleteFeedback(feedbackId);
                router.push('/feedback');
            } catch (error) {
                console.error("Error deleting feedback:", error);
                setIsDeleting(false);
            }
        }
    }

    return (
        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
        </Button>
    );
}
