'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { importTasks } from '@/actions/tasks/import-tasks';
import type { Template, Client } from '@/generated/prisma';

interface ImportTasksFormProps {
  templates: Template[];
  clients: Client[];
  initialClientId?: string;
}

export function ImportTasksForm({ templates, clients, initialClientId }: ImportTasksFormProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClientId || '');
  const [isImporting, setIsImporting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleImport = async () => {
    if (!selectedTemplateId || !selectedClientId) {
      toast({
        title: 'Error',
        description: 'Please select a client and a template.',
        variant: 'destructive',
      });
      return;
    }

    setIsImporting(true);

    try {
      const result = await importTasks({ templateId: selectedTemplateId, clientId: selectedClientId });
      
      toast({
        title: 'Success!',
        description: `${result.count} tasks imported successfully.`,
      });
      
      router.push('/tasks');
      router.refresh();
    } catch (error: any) {
      console.error('Task import failed: ', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to import tasks.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="client">Client</Label>
          <Select
            value={selectedClientId}
            onValueChange={setSelectedClientId}
          >
            <SelectTrigger id="client">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="template">Template</Label>
          <Select
            value={selectedTemplateId}
            onValueChange={setSelectedTemplateId}
          >
            <SelectTrigger id="template">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={isImporting}
        >
          Cancel
        </Button>
        <Button onClick={handleImport} disabled={isImporting || !selectedClientId || !selectedTemplateId}>
          {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Import Tasks
        </Button>
      </div>
    </div>
  );
}
