
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useDoc } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { doc, DocumentReference } from "firebase/firestore";
import { useMemo, use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteReport } from '../actions/delete-report';
import { useRouter } from "next/navigation";

type Report = {
    id: string;
    title: string;
    summary: string;
    generatedOn: string;
};

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const firestore = useFirestore();
    const router = useRouter();

    const reportRef = useMemo(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'reports', id) as DocumentReference<Report>;
    }, [firestore, id]);

    const { data: report, loading } = useDoc<Report>(reportRef);

    const handleDelete = async () => {
        if (!firestore || !id) return;
        if (confirm('Are you sure you want to delete this report?')) {
            await deleteReport(firestore, id);
            router.push('/reports');
        }
    }

  if (loading) {
    return <Card>
        <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
        </CardContent>
    </Card>
  }

  if (!report) {
    return <Card><CardHeader><CardTitle>Report not found</CardTitle></CardHeader></Card>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-2xl">{report.title}</CardTitle>
                <CardDescription>
                    Generated on: {new Date(report.generatedOn).toLocaleString()}
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button asChild>
                    <Link href={`/reports/${id}/edit`}>Edit Report</Link>
                </Button>
                 <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{report.summary}</p>
      </CardContent>
    </Card>
  );
}
