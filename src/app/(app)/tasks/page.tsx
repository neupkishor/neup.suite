
'use client';
import {
  addDoc,
  collection,
  CollectionReference,
  serverTimestamp,
} from 'firebase/firestore';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Loader2,
  PlusCircle,
  MessageSquarePlus,
  Trash,
} from 'lucide-react';
import { useMemo, useState } from 'react';
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
  FormLabel,
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
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Skeleton } from '@/components/ui/skeleton';
import { taskSchema, type Task } from '@/schemas/task';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { CalendarIcon } from 'lucide-react';
import { TaskCard } from './components/task-card';


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
}: {
  setIsCreating: (isCreating: boolean) => void;
  projects: Project[] | null;
}) {
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'To Do',
      assignees: ['Jane Doe'],
      subtasks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'subtasks',
  });
  const [newSubtask, setNewSubtask] = useState('');

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);

    const taskCollection = collection(firestore, 'tasks');
    try {
      await addDoc(taskCollection, {
        ...values,
        deadline: values.deadline
          ? format(values.deadline, 'yyyy-MM-dd')
          : null,
        createdBy: 'user_placeholder',
        createdOn: serverTimestamp(),
      });
      setIsSubmitting(false);
      setIsCreating(false);
      form.reset();
    } catch (error) {
      const permissionError = new FirestorePermissionError({
        path: taskCollection.path,
        operation: 'create',
        requestResourceData: values,
      });
      errorEmitter.emit('permission-error', permissionError);
      setIsSubmitting(false);
    }
  }

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      append({ text: newSubtask.trim(), completed: false });
      setNewSubtask('');
    }
  };

  return (
    <Card className="mb-4 border-2 border-primary">
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Design the new logo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="assignees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign To</FormLabel>
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Deadline (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
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

            {!showDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(true)}
              >
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                Add Details (Description, Subtasks...)
              </Button>
            )}

            {showDetails && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a more detailed description..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="project"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project (Optional)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {projects?.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="To Do">To Do</SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="Done">Done</SelectItem>
                            <SelectItem value="Cancelled">
                              Cancelled
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormLabel>Subtasks</FormLabel>
                  <div className="mt-2 space-y-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <Input value={field.text} readOnly className="bg-muted" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add a new subtask..."
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSubtask();
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddSubtask}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
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
      </CardContent>
    </Card>
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

  const tasksCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'tasks') as CollectionReference<Task>;
  }, [firestore]);
  const { data: tasks, loading: tasksLoading } = useCollection<Task & {id: string}>(
    tasksCollection
  );

  const projectsCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'projects') as CollectionReference<Project>;
  }, [firestore]);
  const { data: projects, loading: projectsLoading } =
    useCollection<Project>(projectsCollection);

  const loading = tasksLoading || projectsLoading;

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">
              Task Management
            </CardTitle>
            <CardDescription>
              View, create, and manage all project tasks.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
       <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {!isCreating && <button
              onClick={() => setIsCreating(true)}
              className="flex w-full items-center gap-2 p-4 text-muted-foreground transition-colors hover:bg-muted/50"
            >
              <PlusCircle className="h-5 w-5" />
              <span className="font-medium">New Task</span>
            </button>}
            {isCreating && (
                <NewTaskItem setIsCreating={setIsCreating} projects={projects} />
            )}
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <TaskCardSkeleton key={i} />
              ))}
            {!loading &&
              tasks?.map((task) => (
                <TaskCard key={task.id} task={task} projects={projects} />
              ))}
            {!loading && tasks?.length === 0 && !isCreating && (
              <div className="p-6 text-center text-muted-foreground">
                No tasks found. Create one to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
