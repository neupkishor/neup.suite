import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditTestingPage({ params }: { params: { id: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Edit Test: {params.id}</CardTitle>
        <CardDescription>
          Update the details of this test.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Form to edit test {params.id} will be here.</p>
      </CardContent>
    </Card>
  );
}
