
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCollection } from "@/firebase";
import type { Template } from "@/schemas/template";
import type { Client } from "@/schemas/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { addTask } from "../actions/add-task";

export default function ImportTasksPage() {
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const cookieClientId = Cookies.get('client');
        if (cookieClientId) {
            setSelectedClientId(cookieClientId);
        }
    }, []);

    const templatesCollection = useMemo(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'templates') as CollectionReference<Template>,
            where('type', '==', 'TaskList')
        );
    }, [firestore]);
    const { data: templates, loading: templatesLoading } = useCollection<Template>(templatesCollection);

    const clientsCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'clients') as CollectionReference<Client>;
    }, [firestore]);
    const { data: clients, loading: clientsLoading } = useCollection<Client>(clientsCollection);
    
    const selectedTemplate = templates?.find(t => t.id === selectedTemplateId);

    const handleImport = async () => {
        if (!firestore || !selectedClientId || !selectedTemplate) {
            toast({ title: 'Error', description: 'Please select a client and a template.', variant: 'destructive'});
            return;
        };

        setIsImporting(true);

        try {
            const tasksToCreate = JSON.parse(selectedTemplate.body);
            if (!Array.isArray(tasksToCreate)) {
                throw new Error("Template body is not a valid JSON array of tasks.");
            }

            const importPromises = tasksToCreate.map(task => {
                const taskData = {
                    ...task,
                    status: 'To Do',
                    clientId: selectedClientId,
                };
                return addTask(firestore, taskData, 'user_placeholder'); // Placeholder for user ID
            });
            
            await Promise.all(importPromises);

            toast({ title: 'Success!', description: `${tasksToCreate.length} tasks imported successfully.`});
            router.push('/tasks');

        } catch (error: any) {
            console.error("Task import failed: ", error);
            toast({ title: 'Error', description: error.message || 'Failed to import tasks.', variant: 'destructive'});
        } finally {
            setIsImporting(false);
        }
    }

    const loading = templatesLoading || clientsLoading;

    if (loading) {
        return <Card><CardHeader><CardTitle>Loading...</CardTitle></CardHeader></Card>
    }


  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Import Tasks from Template</CardTitle>
            <CardDescription>Select a task list template and a client to import tasks for.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 max-w-2xl">
            <div className="space-y-2">
                <Label>Select Template</Label>
                <Select onValueChange={setSelectedTemplateId} value={selectedTemplateId || ''} disabled={loading}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose a task list template..." />
                    </SelectTrigger>
                    <SelectContent>
                        {templates && templates.length > 0 ? templates.map(t => (
                            <SelectItem key={t.id} value={t.id}>{t.name} (v{t.version})</SelectItem>
                        )) : (
                            <div className="p-4 text-sm text-muted-foreground">No task list templates found.</div>
                        )}
                    </SelectContent>
                </Select>
            </div>
            
            <div className="space-y-2">
                <Label>Select Client</Label>
                <Select onValueChange={setSelectedClientId} value={selectedClientId || ''} disabled={loading}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose a client..." />
                    </SelectTrigger>
                    <SelectContent>
                        {clients && clients.length > 0 ? clients.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        )) : (
                            <div className="p-4 text-sm text-muted-foreground">No clients found.</div>
                        )}
                    </SelectContent>
                </Select>
            </div>


            <div className="flex gap-2">
                <Button onClick={handleImport} disabled={!selectedTemplateId || !selectedClientId || isImporting}>
                    {isImporting && <Loader2 className="mr-2 animate-spin" />}
                    Import Tasks
                </Button>
                <Button variant="outline" asChild><Link href="/tasks">Cancel</Link></Button>
            </div>

        </CardContent>
    </Card>
  );
}
