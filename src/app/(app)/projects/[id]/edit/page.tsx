
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useFirestore } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, use } from 'react';
import Link from 'next/link';
import { projectSchema } from '@/schemas/project';
import { updateProject } from '@/actions/projects/update-project';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDoc } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

type Project = {
    id: string;
    name: string;
    status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
    deadline: string;
}

const editProjectSchema = projectSchema.omit({ identifier: true }).extend({
    status: z.enum(['Planning', 'In Progress', 'On Hold', 'Completed']),
})

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const firestore = useFirestore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const projectRef = useMemo(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'projects', id) as DocumentReference<Project>;
  }, [firestore, id]);

  const { data: project, loading } = useDoc<Project>(projectRef);

  const form = useForm<z.infer<typeof editProjectSchema>>({
    resolver: zodResolver(editProjectSchema),
  });

  useEffect(() => {
    if (project) {
      form.reset({
        ...project,
        deadline: new Date(project.deadline),
      });
    }
  }, [project, form]);

  async function onSubmit(values: z.infer<typeof editProjectSchema>) {
    if (!firestore || !id) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await updateProject(firestore, id, {
        ...values,
        deadline: format(values.deadline, 'yyyy-MM-dd'),
      });
      router.push(`/projects/${id}`);
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  }

  if (loading) {
    return <Card>
        <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-8 max-w-2xl">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
            </div>
        </CardContent>
    </Card>
  }
  
  if (!project && !loading) {
    return <Card>
        <CardHeader>
            <CardTitle>Project not found</CardTitle>
        </CardHeader>
        <CardContent>
            <p>The requested project could not be found.</p>
            <Button asChild className="mt-4"><Link href="/projects">Go Back</Link></Button>
        </CardContent>
    </Card>
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Edit Project: {project?.name}
        </CardTitle>
        <CardDescription>
          Update the details for this project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                    <Input placeholder="E.g. Project Phoenix" {...field} />
                </FormControl>
                <FormDescription>
                    This is the public display name of your project.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Deadline</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value ? (
                            format(field.value, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormDescription>
                    The target completion date for the project.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Project
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/projects/${id}`}>Cancel</Link>
              </Button>
            </div>
            {submitError && (
              <p className="text-sm font-medium text-destructive">
                {submitError}
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
