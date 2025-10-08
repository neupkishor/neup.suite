
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalForm } from '../components/goal-form';

export default function AddGoalPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Add New Goal</CardTitle>
        <CardDescription>
          Define a new goal or milestone to track.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GoalForm />
      </CardContent>
    </Card>
  );
}
