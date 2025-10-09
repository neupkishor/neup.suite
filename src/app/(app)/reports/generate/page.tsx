'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference, query, where, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCollection } from "@/firebase";
import type { Template } from "@/schemas/template";
import type { Client } from "@/schemas/client";
import type { Task } from "@/schemas/task";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateAndSaveReport } from "../actions/generate-report";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const parseManualFields = (templateBody: string): string[] => {
    if (!templateBody) return [];
    const regex = /\{\{manual\.(\w+)\}\}/g;
    const matches = [...templateBody.matchAll(regex)];
    // Use a Set to get unique field names
    return [...new Set(matches.map(match => match[1]))];
};

// A very basic Handlebars-like replacer
const renderTemplate = (templateBody: string, data: Record<string, any>): string => {
  let rendered = templateBody;

  // Replace simple placeholders like {{client.name}}
  const simpleRegex = /\{\{client\.(\w+)\}\}/g;
  rendered = rendered.replace(simpleRegex, (match, key) => {
    return data.client?.[key] || match;
  });

  // Replace manual placeholders like {{manual.customNote}}
  const manualRegex = /\{\{manual\.(\w+)\}\}/g;
  rendered = rendered.replace(manualRegex, (match, p1) => {
    return data.manual?.[p1] || match;
  });

  // Handle simple loops like {{#each tasks}}...{{/each}}
  const loopRegex = /\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
    rendered = rendered.replace(loopRegex, (match, p1, innerTemplate) => {
        const items = data[p1];
        if (!Array.isArray(items)) return '';
        
        let allItemsHtml = '';
        for (const item of items) {
            let itemHtml = innerTemplate;
            const itemRegex = /\{\{this\.(\w+)\}\}/g;
            itemHtml = itemHtml.replace(itemRegex, (itemMatch, itemKey) => {
                // Access nested properties if any
                const keys = itemKey.split('.');
                let value = item;
                for (const key of keys) {
                    if (value && typeof value === 'object' && key in value) {
                        value = value[key];
                    } else {
                        return itemMatch;
                    }
                }
                return value;
            });
            allItemsHtml += itemHtml;
        }
        return allItemsHtml;
    });

  return rendered;
};


export default function GenerateReportPage() {
    const [clientId, setClientId] = useState<string|null>(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [manualFields, setManualFields] = useState<string[]>([]);
    const [manualFieldValues, setManualFieldValues] = useState<Record<string, string>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        setClientId(Cookies.get('client') || null);
    }, []);

    const templatesCollection = useMemo(() => {
        if (!firestore || !clientId) return null;
        return query(
            collection(firestore, 'templates') as CollectionReference<Template>,
            where('clientId', '==', clientId),
            where('type', '==', 'Report')
        );
    }, [firestore, clientId]);
    const { data: templates, loading: templatesLoading } = useCollection<Template>(templatesCollection);
    
    const selectedTemplate = templates?.find(t => t.id === selectedTemplateId);

    useEffect(() => {
        if (selectedTemplate?.body) {
            const fields = parseManualFields(selectedTemplate.body);
            setManualFields(fields);
            // Reset values when template changes
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
        if (!firestore || !clientId || !selectedTemplate) {
            toast({ title: 'Error', description: 'Please select a client and a template.', variant: 'destructive'});
            return;
        };

        setIsGenerating(true);

        try {
            // 1. Fetch all required data
            const clientQuery = query(collection(firestore, 'clients'), where('__name__', '==', clientId));
            const clientDoc = await getDocs(clientQuery);
            const clientData = clientDoc.docs[0]?.data() as Client;

            const tasksSnapshot = await getDocs(query(collection(firestore, 'tasks'), where('clientId', '==', clientId)));
            const tasksData = tasksSnapshot.docs.map(doc => doc.data() as Task);
            
            // 2. Combine data
            const fullData = {
                client: clientData,
                tasks: tasksData,
                manual: manualFieldValues,
            };

            // 3. Render template
            const reportContent = renderTemplate(selectedTemplate.body, fullData);

            // 4. Save report
            await generateAndSaveReport(firestore, {
                title: selectedTemplate.name,
                content: reportContent,
                clientId: clientId,
                templateId: selectedTemplate.id,
                manualData: manualFieldValues,
            });

            toast({ title: 'Success!', description: 'Report generated successfully.'});
            router.push('/reports');

        } catch (error) {
            console.error("Report generation failed: ", error);
            toast({ title: 'Error', description: 'Failed to generate report.', variant: 'destructive'});
        } finally {
            setIsGenerating(false);
        }
    }


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

    if (templatesLoading) {
        return <Card><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent><Skeleton className="h-64" /></CardContent></Card>
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
                        {templates && templates.length > 0 ? templates.map(t => (
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
