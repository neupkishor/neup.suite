
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
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
import { Loader2, PlusCircle, Sparkles, Trash2 } from 'lucide-react';
import { useFirestore } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { addTemplate } from '../actions/add-template';
import { templateSchema, taskListItemSchema, type Template } from '@/schemas/template';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { aiGenerateReportTemplate } from '@/ai/flows/ai-generate-report-template';


const formSchema = z.discriminatedUnion('type', [
  z.object({
    name: z.string().min(1, 'Template name is required'),
    description: z.string().optional(),
    type: z.literal('TaskList'),
    tasks: z.array(taskListItemSchema).min(1, 'At least one task is required.'),
    version: z.number().default(1),
    clientId: z.string().min(1, 'Client ID is required'),
  }),
  z.object({
    name: z.string().min(1, 'Template name is required'),
    description: z.string().optional(),
    type: z.enum(['Project', 'Document', 'Report']),
    body: z.string().min(1, 'Body is required'),
    version: z.number().default(1),
    clientId: z.string().min(1, 'Client ID is required'),
  }),
]);


type TemplateFormValues = z.infer<typeof formSchema>;


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
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: (() => {
      if (!template) {
        return {
          name: '',
          description: '',
          type: 'Report',
          body: '',
          version: 1,
          clientId: clientId,
        };
      }
      if (template.type === 'TaskList') {
        try {
          const tasks = JSON.parse(template.body);
          return {
            ...template,
            version: (template.version || 0) + 1,
            description: template.description || '',
            tasks,
          }
        } catch(e) {
          // Fallback if JSON is invalid
           return {
            ...template,
            type: 'TaskList',
            version: (template.version || 0) + 1,
            description: template.description || '',
            tasks: [],
          }
        }
      }
      return {
        ...template,
        version: (template.version || 0) + 1,
        description: template.description || '',
      }
    })() as TemplateFormValues,
  });

  const templateType = useWatch({
      control: form.control,
      name: 'type',
  });

   const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: templateType === 'TaskList' ? 'tasks' : 'body' as never, // Conditional name
  });


  useEffect(() => {
    // We don't need to reset form on type change as discriminated union handles it
  }, [template, clientId, form]);

  const handleGenerateWithAi = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    
    try {
      const response = await aiGenerateReportTemplate({ prompt: aiPrompt });
      form.setValue('body', response.html, { shouldValidate: true });
    } catch (error) {
        console.error("AI generation failed:", error);
        // Optionally, show a toast to the user
    } finally {
        setIsGenerating(false);
    }
  };

  async function onSubmit(values: TemplateFormValues) {
    if (!firestore) return;
    setIsSubmitting(true);
    
    let body = '';
    if (values.type === 'TaskList') {
      body = JSON.stringify(values.tasks, null, 2);
    } else {
      body = values.body;
    }

    try {
      const dataToSubmit: z.infer<typeof templateSchema> = {
          name: values.name,
          description: values.description,
          type: values.type,
          version: (template?.version || 0) + 1,
          clientId: values.clientId,
          body: body,
      };

      await addTemplate(firestore, {...dataToSubmit, createdBy: 'Jane Doe'});
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
        case 'TaskList': return 'Tasks';
        default: return 'Template Body';
    }
  }

  const getBodyDescription = () => {
    switch(templateType) {
        case 'Report': return 'Write your report content using HTML. Use Handlebars-style placeholders like {{{{client.name}}}} for auto-data or {{{{manual.yourFieldName}}}} for manual entry fields.';
        case 'TaskList': return 'Add, edit, and reorder the tasks that will be created when this template is used.';
        default: return 'Define the template content.';
    }
  }

    const getBodyPlaceholder = () => {
        switch(templateType) {
            case 'Report': return reportPlaceHolder;
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
                {templateType === 'TaskList' ? (
                     <div className="space-y-4">
                        {(fields as any[]).map((field, index) => (
                           <div key={field.id} className="p-4 border rounded-lg space-y-3 bg-muted/50">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold">Task {index + 1}</h4>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash2/></Button>
                                </div>
                                <FormField
                                    control={form.control as any}
                                    name={`tasks.${index}.title`}
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl><Input placeholder="Task title" {...field} /></FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control as any}
                                    name={`tasks.${index}.description`}
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl><Textarea placeholder="Optional: describe the task..." {...field} /></FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                           </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => append({ title: '', description: '' })}>
                            <PlusCircle className="mr-2" /> Add Task
                        </Button>
                        <FormMessage>{(form.formState.errors as any).tasks?.root?.message}</FormMessage>
                    </div>
                ) : (
                    <FormField
                        control={form.control as any}
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
                )}
            </CardContent>
        </Card>

        {templateType === 'Report' && (
          <Card>
            <CardHeader>
              <CardTitle>Generate with AI</CardTitle>
              <CardDescription>
                Describe the report you want to build. Our intelligent engine will generate the HTML for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="e.g., A weekly progress report summarizing completed tasks and highlighting upcoming deadlines."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={4}
              />
              <Button type="button" onClick={handleGenerateWithAi} disabled={isGenerating || !aiPrompt}>
                {isGenerating ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                Generate Report HTML
              </Button>
            </CardContent>
          </Card>
        )}
        
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
