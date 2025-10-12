
'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UploadCloud } from 'lucide-react';
import { useFirestore } from '@/firebase/provider';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { uploadFile } from '@/lib/upload-service';
import { Textarea } from '@/components/ui/textarea';
import Cookies from 'js-cookie';
import { Progress } from '@/components/ui/progress';

export function UploadDocumentDialog({ children }: { children: React.ReactNode }) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firestore = useFirestore();
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
        setClientId(Cookies.get('client') || null);
    }
  }, [isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name);
      }
    }
  };

  const resetState = () => {
    setFile(null);
    setName('');
    setNotes('');
    setIsUploading(false);
    setError(null);
    setUploadProgress(0);
  }

  const handleUpload = async () => {
    if (!file || !firestore || !clientId) {
      setError('Please select a file and ensure a client is selected.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const contentId = `doc-${Date.now()}`;
      const fileUrl = await uploadFile(file, contentId, name, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });

      const documentsCollection = collection(firestore, 'documents');
      await addDoc(documentsCollection, {
        name: name || file.name,
        url: fileUrl,
        status: 'In Review',
        version: '1.0',
        fileType: file.type,
        size: file.size,
        notes: notes,
        uploadedBy: 'Jane Doe', // Placeholder
        clientId: clientId,
        createdOn: serverTimestamp(),
        updatedOn: serverTimestamp(),
      });
      
      setIsOpen(false);
      resetState();

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
            resetState();
        }
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Select a file and add details to upload it to the repository.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div
              className="mt-1 flex justify-center rounded-md border-2 border-dashed border-input px-6 pt-5 pb-6 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                {file ? (
                    <p className="text-sm text-foreground">{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                )}
                <p className="text-xs text-muted-foreground">Any file type up to 50MB</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
            />
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="document-name">Document Name</Label>
            <Input
              id="document-name"
              name="document-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Master Service Agreement.pdf"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a brief description or any relevant notes..."
            />
          </div>
          {isUploading && (
            <div className="space-y-2">
              <Label>Upload Progress</Label>
              <Progress value={uploadProgress} />
              <p className="text-sm text-muted-foreground text-center">{uploadProgress}%</p>
            </div>
          )}
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleUpload} disabled={isUploading || !file}>
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
