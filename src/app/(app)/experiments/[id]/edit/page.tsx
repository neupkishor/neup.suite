import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditExperimentPage({ params }: { params: { id: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Edit Experiment: {params.id}</CardTitle>
        <CardDescription>
          Update the details of this experiment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Form to edit experiment {params.id} will be here.</p>
      </CardContent>
    </Card>
  );
}
