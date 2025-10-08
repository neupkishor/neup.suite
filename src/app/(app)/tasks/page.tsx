
'use client';
import {
  addDoc,
  collection,
  CollectionReference,
  serverTimestamp,
} from 'firebase/firestore';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CalendarIcon,
  CheckCircle,
  Circle,
  Loader2,
  PlusCircle,
  XCircle,
  Calendar as CalendarIconLucide,
  User as UserIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCollection } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { placeholderImages } from '@/lib/placeholder-images';
import { taskSchema } from '@/schemas/task';
import { Textarea } from '@/components/ui/textarea';

type Task = {
  id: string;
  title: string;
  assignee: string;
  deadline?: string;
  status: 'To Do' | 'In Progress' | 'Done' | 'Cancelled';
  project: string;
};

type Project = {
    id: string;
    name: string;
}

const teamMembers = [
    { name: 'Jane Doe', avatarId: 'user-avatar' },
    { name: 'Alex Ray', avatarId: 'contact-1' },
    { name: 'Jordan Smith', avatarId: 'contact-2' },
    { name: 'Casey Williams', avatarId: 'contact-4' },
];


function NewTaskForm({ setOpen, projects }: { setOpen: (open: boolean) => void, projects: Project[] | null }) {
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'To Do',
      subtasks: [],
    },
  });

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);

    const taskCollection = collection(firestore, 'tasks');
    try {
      await addDoc(taskCollection, {
        ...values,
        deadline: values.deadline ? format(values.deadline, 'yyyy-MM-dd') : null,
        createdBy: 'user_placeholder',
        createdOn: serverTimestamp(),
      });
      setIsSubmitting(false);
      setOpen(false);
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

  return (
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Add a more detailed description..." {...field} />
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
                  <FormLabel>Project</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects?.map(project => (
                        <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
            control={form.control}
            name="assignee"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Assign To</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a team member" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {teamMembers.map(member => (
                        <SelectItem key={member.name} value={member.name}>{member.name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
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
             <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="To Do">To Do</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Task
        </Button>
      </form>
    </Form>
  );
}

const statusConfig = {
    "To Do": { icon: Circle, color: 'text-muted-foreground' },
    "In Progress": { icon: Loader2, color: 'text-primary' },
    "Done": { icon: CheckCircle, color: 'text-chart-2' },
    "Cancelled": { icon: XCircle, color: 'text-destructive' }
}

const getStatusVariant = (status: Task['status']) => {
    switch (status) {
        case 'Done': return 'default';
        case 'In Progress': return 'secondary';
        case 'Cancelled': return 'destructive';
        default: return 'outline';
    }
}

function TaskCard({ task, projects }: { task: Task, projects: Project[] | null }) {
    const StatusIcon = statusConfig[task.status]?.icon || Circle;
    const assignee = teamMembers.find(m => m.name === task.assignee);
    const avatar = placeholderImages.find(p => p.id === assignee?.avatarId);
    const project = projects?.find(p => p.id === task.project);

    return (
        <Card>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
                <div className="flex items-center gap-4 flex-1">
                     <StatusIcon className={cn("h-6 w-6 shrink-0", statusConfig[task.status].color, task.status === 'In Progress' && 'animate-spin')} />
                    <div>
                        <p className="font-semibold">{task.title}</p>
                        {project && <p className="text-sm text-muted-foreground">{project.name}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6 text-sm text-muted-foreground ml-10 sm:ml-0">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            {avatar && <AvatarImage src={avatar.imageUrl} alt={task.assignee} />}
                            <AvatarFallback>{task.assignee.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span>{task.assignee}</span>
                    </div>
                    {task.deadline && (
                        <div className="flex items-center gap-1.5">
                            <CalendarIconLucide className="h-4 w-4" />
                            <span>{format(new Date(task.deadline), 'MMM d')}</span>
                        </div>
                    )}
                </div>
                <Badge variant={getStatusVariant(task.status)} className="w-28 justify-center shrink-0 hidden lg:flex">
                    {task.status}
                </Badge>
            </CardContent>
        </Card>
    );
}

function TaskCardSkeleton() {
    return (
        <Card>
            <CardContent className="flex items-center gap-4 p-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center gap-6">
                     <Skeleton className="h-8 w-24" />
                     <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-6 w-28 hidden lg:block" />
            </CardContent>
        </Card>
    );
}


export default function TasksPage() {
  const [open, setOpen] = useState(false);
  const firestore = useFirestore();

  const tasksCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'tasks') as CollectionReference<Task>;
  }, [firestore]);
  const { data: tasks, loading: tasksLoading } = useCollection<Task>(tasksCollection);

  const projectsCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'projects') as CollectionReference<Project>;
  }, [firestore]);
  const { data: projects, loading: projectsLoading } = useCollection<Project>(projectsCollection);


  const loading = tasksLoading || projectsLoading;

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Task Management</CardTitle>
            <CardDescription>
              View, create, and manage all project tasks.
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Fill out the details below to add a new task.
                </DialogDescription>
              </DialogHeader>
              <NewTaskForm setOpen={setOpen} projects={projects} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <div className="space-y-4">
        {loading &&
            Array.from({ length: 3 }).map((_, i) => (
                <TaskCardSkeleton key={i} />
            ))
        }
        {!loading && tasks?.map((task) => (
            <TaskCard key={task.id} task={task} projects={projects} />
        ))}
         {!loading && tasks?.length === 0 && (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No tasks found. Create one to get started.
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
