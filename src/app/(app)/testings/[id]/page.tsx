import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TestingDetailPage({ params }: { params: { id: string } }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-2xl">Test: {params.id}</CardTitle>
             <Button asChild>
                <Link href={`/testings/${params.id}/edit`}>Edit Test</Link>
            </Button>
        </div>
        <CardDescription>
          Viewing details for a specific test.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Details for test {params.id} will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
