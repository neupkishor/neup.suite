import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TestingsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-2xl">Testings</CardTitle>
            <Button asChild>
                <Link href="/testings/add">Add Test</Link>
            </Button>
        </div>
        <CardDescription>
          Manage and review your A/B tests and other test results.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>List of tests will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
