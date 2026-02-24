'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteDocument } from '@/actions/documents/delete-document';

export function DeleteDocumentButton({ documentId }: { documentId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this document?')) {
      setIsDeleting(true);
      try {
        await deleteDocument(documentId);
        router.push('/documents');
      } catch (error) {
        console.error("Failed to delete document:", error);
        setIsDeleting(false);
        alert("Failed to delete document. Please try again.");
      }
    }
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
      <Trash2 className="h-4 w-4 mr-2" />
      {isDeleting ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
