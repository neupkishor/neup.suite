'use client';

import { Button } from "@/components/ui/button";
import { deleteProject } from "@/actions/projects/delete-project";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            setIsDeleting(true);
            try {
                await deleteProject(projectId);
                router.push('/projects');
            } catch (error) {
                console.error("Error deleting project:", error);
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
