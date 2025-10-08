
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference, query, where } from "firebase/firestore";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart } from "lucide-react";
import { AddItemCard } from "@/components/add-item-card";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";

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
    const [clientId, setClientId] = useState<string|null>(null);

    useEffect(() => {
        setClientId(Cookies.get('client') || null);
    }, []);

    const reportsCollection = useMemo(() => {
        if (!firestore || !clientId) return null;
        return query(
            collection(firestore, 'reports') as CollectionReference<Report>,
            where('clientId', '==', clientId)
        );
    }, [firestore, clientId]);

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
       {!clientId ? (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">Please select a client to manage their reports.</p>
                    <Button asChild><Link href="/clients">Select Client</Link></Button>
                </CardContent>
            </Card>
        ) : (
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
          {!loading && reports?.length === 0 && (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No reports found for this client.
                </CardContent>
            </Card>
        )}
      </div>
      )}
    </div>
  );
}
