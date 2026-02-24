'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteContact } from '@/actions/contacts/delete-contact';

export function DeleteContactButton({ contactId }: { contactId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this contact?')) {
      setIsDeleting(true);
      try {
        await deleteContact(contactId);
        router.push('/contacts');
      } catch (error) {
        console.error("Failed to delete contact:", error);
        setIsDeleting(false);
        alert("Failed to delete contact. Please try again.");
      }
    }
  };

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
      <Trash2 className="mr-2 h-4 w-4" />
      {isDeleting ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
