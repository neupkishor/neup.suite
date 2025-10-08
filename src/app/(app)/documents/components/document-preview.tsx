
'use client';
import Image from 'next/image';
import { File, Music, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type DocumentPreviewProps = {
  url: string;
  fileType: string;
};

export function DocumentPreview({ url, fileType }: DocumentPreviewProps) {
  if (fileType.startsWith('image/')) {
    return (
      <div className="relative aspect-video w-full max-w-lg mx-auto">
        <Image src={url} alt="Document preview" fill className="object-contain rounded-md border" />
      </div>
    );
  }

  if (fileType === 'application/pdf') {
    return (
      <div className="aspect-[4/5] w-full">
        <object data={url} type="application/pdf" width="100%" height="100%">
          <Card>
            <CardContent className="p-4 text-center">
              <p>It appears you don't have a PDF plugin for this browser.</p>
              <a href={url} className="text-primary hover:underline" download>Click here to download the PDF</a>
            </CardContent>
          </Card>
        </object>
      </div>
    );
  }

  if (fileType.startsWith('audio/')) {
    return (
      <div>
        <audio controls src={url} className="w-full">
          Your browser does not support the audio element.
          <a href={url} download>Download audio</a>
        </audio>
      </div>
    );
  }

  // Fallback for other file types
  return (
    <Card className="bg-muted/50">
        <CardContent className="p-8 flex flex-col items-center justify-center gap-4 text-center">
            <File className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">No preview available for this file type.</p>
            <a href={url} className="text-primary hover:underline" download>Download File</a>
        </CardContent>
    </Card>
  );
}
