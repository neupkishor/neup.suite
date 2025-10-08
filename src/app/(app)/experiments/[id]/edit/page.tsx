
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { use } from "react";

export default function EditExperimentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Edit Experiment: {id}</CardTitle>
        <CardDescription>
          Update the details of this experiment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Form to edit experiment {id} will be here.</p>
      </CardContent>
    </Card>
  );
}
