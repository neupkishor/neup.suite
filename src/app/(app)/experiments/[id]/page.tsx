
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { use } from "react";

export default function ExperimentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-2xl">Experiment: {id}</CardTitle>
            <Button asChild>
                <Link href={`/experiments/${id}/edit`}>Edit Experiment</Link>
            </Button>
        </div>
        <CardDescription>
          Viewing details for a specific experiment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Details for experiment {id} will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
