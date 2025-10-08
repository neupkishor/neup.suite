
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DiscussionForm } from '../components/discussion-form';

export default function AddDiscussionPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Start a New Discussion</CardTitle>
        <CardDescription>
          Create a new thread to start a conversation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DiscussionForm />
      </CardContent>
    </Card>
  );
}
