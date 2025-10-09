
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
import { Loader2, PlusCircle, Trash2, Upload, Link as LinkIcon, File as FileIcon } from 'lucide-react';
import { useFirestore } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { activitySchema, type Activity } from '@/schemas/activity';
import { addDoc, updateDoc, collection, serverTimestamp, doc } from 'firebase/firestore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadFile } from '@/lib/upload-service';

type ActivityFormValues = z.infer<typeof activitySchema>;
type Project = { id: string; name: string };

export function ActivityForm({ activity, clientId, projects }: { activity?: Activity, clientId: string, projects: Project[] }) {
  const firestore = useFirestore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: activity || {
      title: '',
      description: '',
      results: '',
      links: [],
      files: [],
      projectId: undefined,
      clientId: clientId,
    },
  });

  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
    control: form.control,
    name: 'links',
  });
  
  const { fields: fileFields, append: appendFile, remove: removeFile } = useFieldArray({
    control: form.control,
    name: 'files'
  });

  useEffect(() => {
    form.reset(activity || {
      title: '',
      description: '',
      results: '',
      links: [],
      files: [],
      projectId: undefined,
      clientId: clientId,
    });
  }, [activity, clientId, projects, form]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const uploadPromises = Array.from(files).map(file => {
        const contentId = `activity-file-${Date.now()}`;
        return uploadFile(file, contentId, file.name);
      });

      const urls = await Promise.all(uploadPromises);

      urls.forEach((url, index) => {
        appendFile({ name: files[index].name, url: url });
      });

    } catch (error: any) {
      setSubmitError(error.message || 'Failed to upload files.');
    } finally {
      setIsSubmitting(false);
       if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };


  async function onSubmit(values: ActivityFormValues) {
    if (!firestore) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (activity?.id) {
        const activityDoc = doc(firestore, 'activities', activity.id);
        await updateDoc(activityDoc, { ...values, updatedOn: serverTimestamp() });
        router.push(`/activities/${activity.id}`);
      } else {
        const activityCollection = collection(firestore, 'activities');
        await addDoc(activityCollection, { ...values, createdBy: 'Jane Doe', createdOn: serverTimestamp() });
        router.push('/activities');
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
        <Card>
          <CardHeader><CardTitle>Core Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title / Summary</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Deployed new feature for user authentication" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Project (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Associate with a project" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {projects.map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (What was done?)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the work that was performed in detail..." {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="results"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Results (What was the outcome?)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the outcome, impact, or results of this activity..." {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Attachments</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <FormLabel>Links</FormLabel>
                    {linkFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-center mt-2">
                           <FormField control={form.control} name={`links.${index}`} render={({ field }) => (
                                <FormItem className="flex-1"><FormControl><Input placeholder="https://example.com" {...field} autoComplete="off" /></FormControl></FormItem>
                           )}/>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeLink(index)}><Trash2/></Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendLink('')}><PlusCircle className="mr-2"/> Add Link</Button>
                </div>
                 <div>
                    <FormLabel>Files</FormLabel>
                    <div className="space-y-2 mt-2">
                        {fileFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-center p-2 rounded-md border">
                                <FileIcon className="h-5 w-5 text-muted-foreground" />
                                <Link href={field.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline flex-1 truncate">{field.name}</Link>
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeFile(index)}><Trash2/></Button>
                            </div>
                        ))}
                    </div>
                     <div className="mt-2">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
                        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 animate-spin" /> : <Upload className="mr-2" />}
                            Upload Files
                        </Button>
                     </div>
                </div>
            </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
            {activity ? 'Update Activity' : 'Save Activity'}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/activities">Cancel</Link>
          </Button>
        </div>
        {submitError && (
          <p className="text-sm font-medium text-destructive">{submitError}</p>
        )}
      </form>
    </Form>
  );
}

    