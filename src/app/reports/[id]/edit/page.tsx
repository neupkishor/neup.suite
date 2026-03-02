
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportForm } from '@/app/reports/components/report-form';
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditReportPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const report = await prisma.report.findUnique({
        where: { id },
    });

    if (!report) {
        return notFound();
    }

    const reportData = {
        ...report,
        manualData: report.manualData ? JSON.parse(JSON.stringify(report.manualData)) : undefined,
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Edit Report</CardTitle>
                <CardDescription>
                    Update the details of this report.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ReportForm report={{...reportData, templateId: reportData.templateId || undefined}} clientId={report.clientId} />
            </CardContent>
        </Card>
    );
}
