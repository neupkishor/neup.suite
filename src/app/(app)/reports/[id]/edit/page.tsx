
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportForm } from '../components/report-form';
import { useDoc } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { doc, DocumentReference } from "firebase/firestore";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Report = {
    id: string;
    title: string;
    summary: string;
};


export default function EditReportPage({ params }: { params: { id: string } }) {
    const firestore = useFirestore();
    const reportRef = useMemo(() => {
        if (!firestore || !params.id) return null;
        return doc(firestore, 'reports', params.id) as DocumentReference<Report>;
    }, [firestore, params.id]);

    const { data: report, loading } = useDoc<Report>(reportRef);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Edit Report</CardTitle>
        <CardDescription>
          Update the details of this report.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <Skeleton className="h-64" />}
        {report && <ReportForm report={report} />}
      </CardContent>
    </Card>
  );
}
