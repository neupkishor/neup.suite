'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Template } from "@/generated/prisma";
import { parseManualFields } from "@/lib/template-renderer";
import { generateReportAction } from '@/actions/reports';
import Link from "next/link";

interface ReportGeneratorProps {
    templates: Template[];
    clientId: string;
}

export function ReportGenerator({ templates, clientId }: ReportGeneratorProps) {
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [manualFields, setManualFields] = useState<string[]>([]);
    const [manualFieldValues, setManualFieldValues] = useState<Record<string, string>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    
    const router = useRouter();
    const { toast } = useToast();

    const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

    useEffect(() => {
        if (selectedTemplate?.body) {
            const fields = parseManualFields(selectedTemplate.body);
            setManualFields(fields);
            setManualFieldValues(fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));
        } else {
            setManualFields([]);
            setManualFieldValues({});
        }
    }, [selectedTemplate]);

    const handleManualFieldChange = (field: string, value: string) => {
        setManualFieldValues(prev => ({ ...prev, [field]: value }));
    };
    
    const handleGenerate = async () => {
        if (!clientId || !selectedTemplateId) {
            toast({ title: 'Error', description: 'Please select a template.', variant: 'destructive'});
            return;
        };

        setIsGenerating(true);

        try {
            await generateReportAction({
                templateId: selectedTemplateId,
                clientId,
                manualData: manualFieldValues,
            });

            toast({ title: 'Success!', description: 'Report generated successfully.'});
            router.push('/reports');
            router.refresh();

        } catch (error) {
            console.error("Report generation failed: ", error);
            toast({ title: 'Error', description: 'Failed to generate report.', variant: 'destructive'});
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Generate Report from Template</CardTitle>
                <CardDescription>Select a template and fill in any required manual fields to generate your report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 max-w-2xl">
                <div className="space-y-2">
                    <Label>Select Template</Label>
                    <Select onValueChange={setSelectedTemplateId} value={selectedTemplateId || ''}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a report template..." />
                        </SelectTrigger>
                        <SelectContent>
                            {templates.length > 0 ? templates.map(t => (
                                <SelectItem key={t.id} value={t.id}>{t.name} (v{t.version})</SelectItem>
                            )) : (
                                <div className="p-4 text-sm text-muted-foreground">No report templates found for this client.</div>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {selectedTemplate && manualFields.length > 0 && (
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="font-medium text-lg">Manual Data Entry</h3>
                        {manualFields.map(field => (
                            <div key={field} className="space-y-2">
                                <Label htmlFor={`manual-${field}`} className="capitalize">{field.replace(/_/g, ' ')}</Label>
                                <Textarea 
                                    id={`manual-${field}`} 
                                    value={manualFieldValues[field] || ''}
                                    onChange={(e) => handleManualFieldChange(field, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-2">
                    <Button onClick={handleGenerate} disabled={!selectedTemplateId || isGenerating}>
                        {isGenerating && <Loader2 className="mr-2 animate-spin" />}
                        Generate Report
                    </Button>
                    <Button variant="outline" asChild><Link href="/reports">Cancel</Link></Button>
                </div>

            </CardContent>
        </Card>
    );
}
