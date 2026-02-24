'use client';

import { Button } from "@/components/ui/button";
import { deleteTemplate } from '@/actions/templates/delete-template';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function DeleteTemplateButton({ templateId }: { templateId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this template?')) {
            setIsDeleting(true);
            try {
                await deleteTemplate(templateId);
                router.push('/templates');
            } catch (error) {
                console.error("Failed to delete template:", error);
                setIsDeleting(false);
                alert("Failed to delete template. Please try again.");
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
