
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { addTemplate } from '../actions/add-template';
import { templateSchema } from '@/schemas/template';
import type { Template } from '@/schemas/template';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type TemplateFormValues = z.infer<typeof templateSchema>;

const prepareDataForForm = (template?: Template, clientId?: string): TemplateFormValues => {
    const defaultValues: TemplateFormValues = {
      name: '',
      description: '',
      type: 'Report',
      body: '',
      version: 1,
      clientId: clientId || '',
    };

    if (!template) {
        return defaultValues;
    }

    return {
        ...defaultValues,
        ...template,
        version: (template.version || 0) + 1,
        description: template.description || '',
    };
};

const taskListPlaceholder = `[
  {
    "title": "Onboarding Call",
    "description": "Initial call with the client to discuss project goals."
  },
  {
    "title": "Send Welcome Packet",
    "assignees": ["Jane Doe"]
  }
]`;

const reportPlaceHolder = `<h1>Monthly Report for {{{{client.name}}}}</h1>

<h2>Tasks Completed</h2>
<ul>
{{#each tasks}}
  <li>{{this.title}}</li>
{{/each}}
</ul>

<h2>Notes</h2>
<p>{{{{manual.notes}}}}</p>
`;


export function TemplateForm({ template, clientId }: { template?: Template; clientId: string }) {
  const firestore = useFirestore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: prepareDataForForm(template, clientId),
  });

  const templateType = useWatch({
      control: form.control,
      name: 'type',
  });

  useEffect(() => {
    form.reset(prepareDataForForm(template, clientId));
  }, [template, clientId, form]);

  async function onSubmit(values: TemplateFormValues) {
    if (!firestore) return;
    setIsSubmitting(true);
    
    try {
        // For TaskList, validate that body is valid JSON
        if (values.type === 'TaskList') {
            try {
                JSON.parse(values.body);
            } catch (e) {
                form.setError('body', { type: 'manual', message: 'Task List body must be valid JSON.' });
                setIsSubmitting(false);
                return;
            }
        }

        const dataToSubmit = {
            ...values,
            version: (template?.version || 0) + 1,
            createdBy: 'Jane Doe', // Placeholder
        };

        await addTemplate(firestore, dataToSubmit as any);
        router.push('/templates');
        router.refresh();

    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  }

  const getBodyLabel = () => {
    switch(templateType) {
        case 'Report': return 'Report Body (HTML)';
        case 'TaskList': return 'Task List (JSON)';
        default: return 'Template Body';
    }
  }

  const getBodyDescription = () => {
    switch(templateType) {
        case 'Report': return 'Write your report content using HTML. Use Handlebars-style placeholders like {{{{client.name}}}} for auto-data or {{{{manual.yourFieldName}}}} for manual entry fields.';
        case 'TaskList': return 'Define tasks as a JSON array. Each object should represent a task with properties like "title", "description", "assignees", etc.';
        default: return 'Define the template content.';
    }
  }

    const getBodyPlaceholder = () => {
        switch(templateType) {
            case 'Report': return reportPlaceHolder;
            case 'TaskList': return taskListPlaceholder;
            default: return '';
        }
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
        <Card>
            <CardHeader>
                <CardTitle>Template Details</CardTitle>
                <CardDescription>Give your template a name and a description to identify it easily.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Monthly Project Summary" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Describe what this template is for..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Template Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!template}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Report">Report</SelectItem>
                            <SelectItem value="TaskList">Task List</SelectItem>
                            <SelectItem value="Project">Project</SelectItem>
                            <SelectItem value="Document">Document</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>{getBodyLabel()}</CardTitle>
                <CardDescription>
                    {getBodyDescription()}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Textarea {...field} rows={20} placeholder={getBodyPlaceholder()} className="font-mono"/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
        
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
            {template ? 'Save as New Version' : 'Create Template'}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/templates">Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
