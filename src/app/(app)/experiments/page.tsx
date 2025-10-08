import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ExperimentsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-2xl">Experiments</CardTitle>
            <Button asChild>
                <Link href="/experiments/add">Add Experiment</Link>
            </Button>
        </div>
        <CardDescription>
          Track your ongoing and completed experiments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>List of experiments will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
