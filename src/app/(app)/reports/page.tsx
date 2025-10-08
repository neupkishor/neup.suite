
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart } from "lucide-react";

type Report = {
    id: string;
    title: string;
    generatedOn: string;
};

function ReportCard({ report }: { report: Report }) {
    return (
        <Card>
            <CardContent className="p-4">
                <Link href={`/reports/${report.id}`} className="font-semibold text-lg hover:underline">{report.title}</Link>
                <p className="text-sm text-muted-foreground">Generated on: {new Date(report.generatedOn).toLocaleDateString()}</p>
            </CardContent>
        </Card>
    )
}

export default function ReportsPage() {
    const firestore = useFirestore();

    const reportsCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'reports') as CollectionReference<Report>;
    }, [firestore]);

    const { data: reports, loading } = useCollection<Report>(reportsCollection);

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-2xl">Reports</CardTitle>
                <CardDescription>
                View, create, and manage your reports.
                </CardDescription>
            </div>
            <Button asChild>
                <Link href="/reports/add"><BarChart className="mr-2 h-4 w-4"/>New Report</Link>
            </Button>
        </div>
      </CardHeader>
      <div className="space-y-4">
        {loading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        {reports?.map(report => <ReportCard key={report.id} report={report} />)}
      </div>
      {!loading && reports?.length === 0 && (
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                No reports found.
            </CardContent>
        </Card>
      )}
    </div>
  );
}
