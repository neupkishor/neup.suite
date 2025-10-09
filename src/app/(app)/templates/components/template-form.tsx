
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Loader2, Plus, Trash2, Heading1, Heading2, Pilcrow, Type, BarChart } from 'lucide-react';
import { useFirestore } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { addTemplate } from '../actions/add-template';
import { templateSchema } from '@/schemas/template';
import type { Template, ReportBlock } from '@/schemas/template';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

type TemplateFormValues = z.infer<typeof templateSchema>;

const prepareDataForForm = (template?: Template, clientId?: string): TemplateFormValues => {
    const defaultValues: TemplateFormValues = {
      name: '',
      description: '',
      type: 'Report',
      data: [],
      version: 1,
      clientId: clientId || '',
    };

    if (!template) {
        return defaultValues;
    }

    return {
        ...defaultValues,
        ...template,
        description: template.description || '',
    };
}


export function TemplateForm({ template, clientId }: { template?: Template, clientId: string }) {
  const firestore = useFirestore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: prepareDataForForm(template, clientId),
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "data"
  });

  useEffect(() => {
    form.reset(prepareDataForForm(template, clientId));
  }, [template, clientId, form])

  const addBlock = (type: ReportBlock['type']) => {
    const newBlock: any = { id: crypto.randomUUID(), type };
    if (type === 'title' || type === 'subtitle' || type === 'paragraph') newBlock.text = '';
    if (type === 'keyValue') { newBlock.key = ''; newBlock.valueSource = ''; }
    if (type === 'chart') { newBlock.chartType = 'bar'; newBlock.dataSource = ''; }
    append(newBlock);
  }

  async function onSubmit(values: TemplateFormValues) {
    if (!firestore) return;
    setIsSubmitting(true);
    
    try {
        const dataToSubmit = {
            ...values,
            version: (template?.version || 0) + 1,
            createdBy: 'Jane Doe',
        };

        await addTemplate(firestore, dataToSubmit as any);
        router.push('/templates');
        router.refresh();

    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="Report">Report</SelectItem>
                    <SelectItem value="Project">Project</SelectItem>
                    <SelectItem value="TaskList">Task List</SelectItem>
                    <SelectItem value="Document">Document</SelectItem>
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />

        <div>
            <FormLabel>Report Blocks</FormLabel>
            <Card className="mt-2">
                <CardContent className="p-4 space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg space-y-2 relative bg-muted/50">
                            <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                            {(field as ReportBlock).type === 'title' && (
                                <FormField control={form.control} name={`data.${index}.text`} render={({ field }) => (
                                    <FormItem><FormLabel className="flex items-center gap-2"><Heading1 /> Title</FormLabel><FormControl><Input placeholder="Main Report Title" {...field} /></FormControl></FormItem>
                                )}/>
                            )}
                            {(field as ReportBlock).type === 'subtitle' && (
                                <FormField control={form.control} name={`data.${index}.text`} render={({ field }) => (
                                    <FormItem><FormLabel className="flex items-center gap-2"><Heading2 /> Subtitle</FormLabel><FormControl><Input placeholder="Section Header" {...field} /></FormControl></FormItem>
                                )}/>
                            )}
                            {(field as ReportBlock).type === 'paragraph' && (
                                <FormField control={form.control} name={`data.${index}.text`} render={({ field }) => (
                                    <FormItem><FormLabel className="flex items-center gap-2"><Pilcrow /> Paragraph</FormLabel><FormControl><Textarea placeholder="Introductory text or summary..." {...field} /></FormControl></FormItem>
                                )}/>
                            )}
                             {(field as ReportBlock).type === 'chart' && (
                                <div className="space-y-2">
                                <FormLabel className="flex items-center gap-2"><BarChart /> Chart</FormLabel>
                                <div className="grid grid-cols-2 gap-4">
                                     <FormField control={form.control} name={`data.${index}.chartType`} render={({ field }) => (
                                        <FormItem><FormLabel className="text-xs">Chart Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="bar">Bar</SelectItem><SelectItem value="pie">Pie</SelectItem><SelectItem value="line">Line</SelectItem></SelectContent>
                                        </Select>
                                        </FormItem>
                                    )}/>
                                    <FormField control={form.control} name={`data.${index}.dataSource`} render={({ field }) => (
                                        <FormItem><FormLabel className="text-xs">Data Source</FormLabel><FormControl><Input placeholder="e.g. tasks.byStatus" {...field} /></FormControl></FormItem>
                                    )}/>
                                </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="flex gap-2 flex-wrap">
                        <Button type="button" variant="outline" size="sm" onClick={() => addBlock('title')}><Plus className="mr-2"/> Title</Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => addBlock('subtitle')}><Plus className="mr-2"/> Subtitle</Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => addBlock('paragraph')}><Plus className="mr-2"/> Paragraph</Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => addBlock('chart')}><Plus className="mr-2"/> Chart</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
        
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
