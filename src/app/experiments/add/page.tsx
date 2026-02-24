import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddExperimentPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Add New Experiment</CardTitle>
        <CardDescription>
          Create a new experiment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Form to add a new experiment will be here.</p>
      </CardContent>
    </Card>
  );
}
