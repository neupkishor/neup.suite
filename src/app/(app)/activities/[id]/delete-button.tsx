'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteActivity } from '@/actions/activities/delete-activity';

export function DeleteActivityButton({ activityId }: { activityId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this activity?')) {
      setIsDeleting(true);
      try {
        await deleteActivity(activityId);
        router.push('/activities');
      } catch (error) {
        console.error("Failed to delete activity:", error);
        setIsDeleting(false);
        alert("Failed to delete activity. Please try again.");
      }
    }
  };

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
      {isDeleting ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
