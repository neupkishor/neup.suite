
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart } from "lucide-react";
import { AddItemCard } from "@/components/add-item-card";

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
        </div>
      </CardHeader>
      <div className="grid grid-cols-1 gap-4">
        {!loading && (
            <AddItemCard
                title="New Report"
                href="/reports/add"
                icon={BarChart}
            />
        )}
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
