import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ExperimentDetailPage({ params }: { params: { id: string } }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-2xl">Experiment: {params.id}</CardTitle>
            <Button asChild>
                <Link href={`/experiments/${params.id}/edit`}>Edit Experiment</Link>
            </Button>
        </div>
        <CardDescription>
          Viewing details for a specific experiment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Details for experiment {params.id} will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
