'use client';

import { Button } from "@/components/ui/button";
import { deleteReport } from '@/actions/reports';
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteReportButton({ reportId }: { reportId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this report?')) {
            setIsDeleting(true);
            try {
                await deleteReport(reportId);
                router.push('/reports');
            } catch (error) {
                console.error(error);
                setIsDeleting(false);
            }
        }
    }

    return (
        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
    );
}
