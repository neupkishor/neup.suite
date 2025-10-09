
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <div className="flex flex-col items-center gap-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <SearchX className="h-8 w-8" />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-headline">404 - Page Not Found</h1>
                <p className="text-muted-foreground">
                    Oops! The page you are looking for does not exist. It might have been moved or deleted.
                </p>
            </div>
            <Button asChild>
                <Link href="/home">Go Back to Home</Link>
            </Button>
        </div>
    </div>
  );
}
