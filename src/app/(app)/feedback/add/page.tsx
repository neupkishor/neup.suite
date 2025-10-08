
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackForm } from '../components/feedback-form';

export default function AddFeedbackPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Submit Feedback</CardTitle>
        <CardDescription>
          Provide your comments and feedback.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FeedbackForm />
      </CardContent>
    </Card>
  );
}
