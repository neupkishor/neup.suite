'use client';

import { Button } from "@/components/ui/button";
import { deleteGoal } from '@/actions/goals';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function DeleteGoalButton({ goalId }: { goalId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this goal?')) {
            setIsDeleting(true);
            try {
                await deleteGoal(goalId);
                router.push('/goals');
            } catch (error) {
                console.error("Failed to delete goal:", error);
                setIsDeleting(false);
                alert("Failed to delete goal. Please try again.");
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
