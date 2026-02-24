
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DeleteReportButton } from "./delete-button";

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const report = await prisma.report.findUnique({
        where: { id },
    });

    if (!report) {
        return notFound();
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-2xl">{report.title}</CardTitle>
                        <CardDescription>Generated on {report.generatedOn ? report.generatedOn.toLocaleDateString() : 'N/A'}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                         <Button asChild>
                            <Link href={`/reports/${id}/edit`}>Edit Report</Link>
                        </Button>
                        <DeleteReportButton reportId={id} />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div dangerouslySetInnerHTML={{ __html: report.content }} />
            </CardContent>
        </Card>
    );
}
