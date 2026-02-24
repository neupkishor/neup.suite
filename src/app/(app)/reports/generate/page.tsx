
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ReportGenerator } from "@/app/(app)/reports/generate/report-generator";
import { TemplateType } from "@/generated/prisma";

async function getTemplates(clientId: string) {
    return prisma.template.findMany({
        where: {
            clientId,
            type: TemplateType.Report,
        },
    });
}

export default async function GenerateReportPage() {
    const cookieStore = await cookies();
    const clientId = cookieStore.get('client')?.value;

    if (!clientId) {
        return (
             <Card>
                <CardHeader><CardTitle>Client Not Selected</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Please select a client to generate a report.</p>
                    <Button asChild><Link href="/clients">Select Client</Link></Button>
                </CardContent>
            </Card>
        )
    }

    const templates = await getTemplates(clientId);

    return (
        <ReportGenerator templates={templates} clientId={clientId} />
    );
}
