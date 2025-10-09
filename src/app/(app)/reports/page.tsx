
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference, query, where } from "firebase/firestore";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Upload } from "lucide-react";
import { AddItemCard } from "@/components/add-item-card";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Project } from "@/schemas/project";
import type { Report } from "@/schemas/report";
import { generateReport } from "./actions/generate-report";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
    const { toast } = useToast();
    const [clientId, setClientId] = useState<string|null>(null);
    const [reportType, setReportType] = useState<'client' | 'project'>('client');
    const [selectedProject, setSelectedProject] = useState<string | undefined>();
    const [dateRange, setDateRange] = useState<{ from: Date, to: Date } | undefined>();
    const [isGenerating, setIsGenerating] = useState(false);

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
    const { data: reports, loading: reportsLoading } = useCollection<Report>(reportsCollection);

    const projectsCollection = useMemo(() => {
        if (!firestore || !clientId) return null;
        return query(
            collection(firestore, 'projects') as CollectionReference<Project>,
            where('clientId', '==', clientId)
        );
    }, [firestore, clientId]);
    const { data: projects, loading: projectsLoading } = useCollection<Project>(projectsCollection);

    const handleGenerateReport = async () => {
        if (!firestore || !clientId || !dateRange) {
            toast({
                variant: 'destructive',
                title: "Missing Information",
                description: "Please select a date range to generate a report.",
            })
            return;
        }

        if (reportType === 'project' && !selectedProject) {
            toast({
                variant: 'destructive',
                title: "Missing Information",
                description: "Please select a project to generate a report.",
            })
            return;
        }
        
        setIsGenerating(true);
        try {
            await generateReport(firestore, {
                clientId,
                type: reportType,
                dateRange,
                projectId: selectedProject
            });
            toast({
                title: "Report Generation Started",
                description: "Your report is being generated and will appear in the list shortly.",
            })
        } catch (error) {
             toast({
                variant: 'destructive',
                title: "Error Generating Report",
                description: "There was an issue generating your report. Please try again.",
            })
        } finally {
            setIsGenerating(false);
        }
    }
    
    const loading = reportsLoading || projectsLoading;

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
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Automated Report Generation</CardTitle>
                    <CardDescription>Generate a report based on project or client activity within a specific date range.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Select value={reportType} onValueChange={(value: 'client' | 'project') => setReportType(value)}>
                            <SelectTrigger><SelectValue placeholder="Select report type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="client">Client Report</SelectItem>
                                <SelectItem value="project">Project Report</SelectItem>
                            </SelectContent>
                        </Select>

                        {reportType === 'project' && (
                             <Select value={selectedProject} onValueChange={setSelectedProject}>
                                <SelectTrigger><SelectValue placeholder="Select a project" /></SelectTrigger>
                                <SelectContent>
                                    {projects?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                        <DateRangePicker onUpdate={({ range }) => setDateRange({ from: range.from, to: range.to || range.from })} />
                    </div>
                    <Button onClick={handleGenerateReport} disabled={isGenerating}>
                        {isGenerating && <Loader2 className="mr-2 animate-spin" />}
                        Generate Report
                    </Button>
                </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <AddItemCard
                    title="Create Manual Report"
                    href="/reports/add"
                    icon={BarChart}
                />
                 <AddItemCard
                    title="Upload Report"
                    href="#"
                    icon={Upload}
                />
            </div>

            <CardHeader className="px-0 pt-6">
                <CardTitle>Generated Reports</CardTitle>
            </CardHeader>

            <div className="grid grid-cols-1 gap-4">
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
        </>
      )}
    </div>
  );
}
