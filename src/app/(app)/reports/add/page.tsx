
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportForm } from '../components/report-form';

export default function AddReportPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create New Report</CardTitle>
        <CardDescription>
          Fill in the details to generate a new report.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReportForm />
      </CardContent>
    </Card>
  );
}
