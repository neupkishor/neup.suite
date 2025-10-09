
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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

type TemplateFormValues = z.infer<typeof templateSchema>;

const prepareDataForForm = (template?: Template, clientId?: string): TemplateFormValues => {
    const defaultValues = {
      name: '',
      description: '',
      type: 'Project' as 'Project' | 'TaskList' | 'Document',
      data: '{}',
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
        data: JSON.stringify(template.data, null, 2),
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

  useEffect(() => {
    form.reset(prepareDataForForm(template, clientId));
  }, [template, clientId, form])


  async function onSubmit(values: TemplateFormValues) {
    if (!firestore) return;
    setIsSubmitting(true);
    
    try {
        const dataToSubmit = {
            ...values,
            data: JSON.parse(values.data),
            version: (template?.version || 0) + 1, // Increment version on create/update
            createdBy: 'Jane Doe', // Placeholder
        };

        await addTemplate(firestore, dataToSubmit);
        router.push('/templates');
        router.refresh();

    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Standard Project Setup" {...field} />
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
                    <SelectItem value="Project">Project</SelectItem>
                    <SelectItem value="TaskList">Task List</SelectItem>
                    <SelectItem value="Document">Document</SelectItem>
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />
         <FormField
          control={form.control}
          name="data"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Data (JSON)</FormLabel>
              <FormControl>
                <Textarea placeholder='{ "key": "value" }' {...field} rows={10} className="font-code"/>
              </FormControl>
               <FormMessage />
            </FormItem>
          )}
        />
        
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

    