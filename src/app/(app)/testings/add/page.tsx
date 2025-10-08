import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddTestingPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Add New Test</CardTitle>
        <CardDescription>
          Set up a new test.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Form to add a new test will be here.</p>
      </CardContent>
    </Card>
  );
}
