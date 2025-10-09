
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <SearchX className="h-8 w-8" />
          </div>
          <CardTitle className="mt-4 text-3xl font-headline">404 - Page Not Found</CardTitle>
          <CardDescription>
            Oops! The page you are looking for does not exist. It might have been moved or deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/home">Go Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
