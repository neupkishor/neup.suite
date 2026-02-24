
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BarChart, FilePlus } from "lucide-react";
import { AddItemCard } from "@/components/add-item-card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { Report } from "@/generated/prisma";

async function getReports(clientId: string): Promise<Report[]> {
    return prisma.report.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
    });
}

export default async function ReportsPage() {
    const cookieStore = await cookies();
    const clientId = cookieStore.get('client')?.value;

    const reports = clientId ? await getReports(clientId) : [];

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Reports</CardTitle>
                <CardDescription>
                View and generate reports.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
       {!clientId ? (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">Please select a client to manage their reports.</p>
                    <Button asChild><Link href="/clients">Select Client</Link></Button>
                </CardContent>
            </Card>
        ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <AddItemCard
                    title="Generate Report from Template"
                    href="/reports/generate"
                    icon={FilePlus}
                />
                 <AddItemCard
                    title="Create Manual Report"
                    href="/reports/add"
                    icon={BarChart}
                />
            </div>

            <CardHeader className="px-0 pt-6">
                <CardTitle>Generated Reports</CardTitle>
            </CardHeader>

            <div className="grid grid-cols-1 gap-4">
                {reports.map(report => (
                     <Card key={report.id}>
                        <CardContent className="p-4">
                            <Link href={`/reports/${report.id}`} className="font-semibold text-lg hover:underline">{report.title}</Link>
                            <p className="text-sm text-muted-foreground">Generated on: {report.generatedOn ? report.generatedOn.toLocaleDateString() : 'N/A'}</p>
                        </CardContent>
                    </Card>
                ))}
                {reports.length === 0 && (
                    <Card>
                        <CardContent className="p-6 text-center text-muted-foreground">
                            No reports found for this client.
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
      )}
    </div>
  );
}
