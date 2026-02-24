
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportForm } from '@/app/(app)/reports/components/report-form';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function AddReportPage() {
    const cookieStore = await cookies();
    const clientId = cookieStore.get('client')?.value;

    if (!clientId) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Client Not Selected</CardTitle>
                    <CardDescription>Please select a client before creating a new report.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/clients">Select a Client</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create Manual Report</CardTitle>
        <CardDescription>
          Fill in the details to generate a new report.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReportForm clientId={clientId} />
      </CardContent>
    </Card>
  );
}
