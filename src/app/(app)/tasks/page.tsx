
'use client';
import {
  addDoc,
  collection,
  CollectionReference,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Loader2,
  PlusCircle,
  Download,
} from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';

import { useCollection } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { taskSchema, type Task } from '@/schemas/task';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { CalendarIcon } from 'lucide-react';
import { TaskCard } from './components/task-card';
import Cookies from 'js-cookie';
import { addTask } from './actions/add-task';
import type { Client } from '@/schemas/client';
import Link from 'next/link';

type Project = {
  id: string;
  name: string;
};

const teamMembers = [
  { value: 'Jane Doe', label: 'Jane Doe', avatarId: 'user-avatar' },
  { value: 'Alex Ray', label: 'Alex Ray', avatarId: 'contact-1' },
  { value: 'Jordan Smith', label: 'Jordan Smith', avatarId: 'contact-2' },
  { value: 'Casey Williams', label: 'Casey Williams', avatarId: 'contact-4' },
];

function NewTaskItem({
  setIsCreating,
  projects,
  clients,
  clientId
}: {
  setIsCreating: (isCreating: boolean) => void;
  projects: Project[] | null;
  clients: Client[] | null;
  clientId?: string | null;
}) {
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'To Do',
      assignees: ['Jane Doe'],
      subtasks: [],
      clientId: clientId || '',
    },
  });

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);
    
    try {
      await addTask(firestore, {
        ...values,
        deadline: values.deadline
          ? format(values.deadline, 'yyyy-MM-dd')
          : null,
      }, 'user_placeholder'); // Placeholder for user ID
      setIsCreating(false);
      form.reset();
    } catch (error) {
      console.error('Failed to add task', error);
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="mb-4 p-4 border rounded-lg border-primary">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!clientId && (
                <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                        <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a client..." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {clients?.map((client) => (
                                <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="border-0 text-base font-medium" placeholder="e.g. Design the new logo" {...field} />
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
                    <FormControl>
                    <Textarea
                        placeholder="Add a more detailed description..."
                        className="border-0"
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="assignees"
                render={({ field }) => (
                  <FormItem>
                    <MultiSelect
                      selected={field.value}
                      options={teamMembers}
                      onChange={field.onChange}
                      placeholder="Select team members..."
                      className="w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-2 border-t pt-4 mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Task
              </Button>
            </div>
          </form>
        </Form>
    </div>
  );
}


function TaskCardSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b p-4">
      <Skeleton className="h-6 w-6 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-4 w-2/5" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24 hidden sm:flex" />
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [isCreating, setIsCreating] = useState(false);
  const firestore = useFirestore();
  const [clientId, setClientId] = useState<string | null>(null);

   useEffect(() => {
        setClientId(Cookies.get('client') || null);
    }, []);

  const tasksCollection = useMemo(() => {
    if (!firestore) return null;
    let q = collection(firestore, 'tasks') as CollectionReference<Task>;
    if (clientId) {
      q = query(q, where('clientId', '==', clientId));
    }
    return q;
  }, [firestore, clientId]);

  const { data: tasks, loading: tasksLoading } = useCollection<Task & {id: string}>(
    tasksCollection
  );
  
  const clientsCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'clients') as CollectionReference<Client>;
  }, [firestore]);
  
  const { data: clients, loading: clientsLoading } = useCollection<Client>(clientsCollection);

  const projectsCollection = useMemo(() => {
    if (!firestore) return null;
    let q = collection(firestore, 'projects') as CollectionReference<Project>;
    if (clientId) {
      q = query(q, where('clientId', '==', clientId));
    }
    return q;
  }, [firestore, clientId]);
  const { data: projects, loading: projectsLoading } =
    useCollection<Project>(projectsCollection);

  const loading = tasksLoading || projectsLoading || clientsLoading;

  const getClientName = (cId: string) => {
    return clients?.find(c => c.id === cId)?.name;
  };

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">
              Task Management
            </CardTitle>
            <CardDescription>
              {clientId ? 'View, create, and manage all tasks for the selected client.' : 'View all tasks across all clients.'}
            </CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/tasks/import"><Download /> Import from Template</Link>
          </Button>
        </div>
      </CardHeader>
       <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="flex w-full items-center gap-2 p-4 text-muted-foreground transition-colors hover:bg-muted/50"
              >
                <PlusCircle className="h-5 w-5" />
                <span className="font-medium">New Task</span>
              </button>
            )}
            {isCreating && (
                <NewTaskItem setIsCreating={setIsCreating} projects={projects} clients={clients} clientId={clientId} />
            )}
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <TaskCardSkeleton key={i} />
              ))}
            {!loading &&
              tasks?.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  projects={projects}
                  clientName={!clientId ? getClientName(task.clientId) : undefined}
                />
              ))}
            {!loading && tasks?.length === 0 && !isCreating && (
              <div className="p-6 text-center text-muted-foreground">
                No tasks found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
