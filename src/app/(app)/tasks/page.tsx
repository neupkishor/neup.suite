'use client';
import {
  addDoc,
  collection,
  CollectionReference,
  Firestore,
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
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  FormDescription,
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

type Task = {
  id: string;
  name: string;
  assignee: string;
  deadline: string;
  status: 'To Do' | 'In Progress' | 'Done' | 'Cancelled';
};

const teamMembers = [
    { name: 'Jane Doe', avatarId: 'user-avatar' },
    { name: 'Alex Ray', avatarId: 'contact-1' },
    { name: 'Jordan Smith', avatarId: 'contact-2' },
    { name: 'Casey Williams', avatarId: 'contact-4' },
];

const taskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  assignee: z.string().min(1, 'Please assign the task'),
  deadline: z.date({ required_error: 'A deadline is required' }),
  status: z.enum(['To Do', 'In Progress', 'Done', 'Cancelled']),
});

function NewTaskForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: '',
      status: 'To Do',
    },
  });

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);

    const taskCollection = collection(firestore, 'tasks');
    try {
      await addDoc(taskCollection, {
        ...values,
        deadline: format(values.deadline, 'yyyy-MM-dd'),
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
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
                <FormLabel>Deadline</FormLabel>
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


export default function TasksPage() {
  const [open, setOpen] = useState(false);
  const firestore = useFirestore();
  const tasksCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'tasks') as CollectionReference<Task>;
  }, [firestore]);

  const { data: tasks, loading } = useCollection<Task>(tasksCollection);

  return (
    <Card>
      <CardHeader>
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
              <NewTaskForm setOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                </TableRow>
              ))}
            {!loading && tasks?.map((task) => {
              const StatusIcon = statusConfig[task.status]?.icon || Circle;
              const statusColor = statusConfig[task.status]?.color || 'text-muted-foreground';
              const assignee = teamMembers.find(m => m.name === task.assignee);
              const avatar = placeholderImages.find(p => p.id === assignee?.avatarId);
              return (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                         <Avatar className="h-8 w-8">
                            {avatar && <AvatarImage src={avatar.imageUrl} alt={task.assignee} />}
                            <AvatarFallback>{task.assignee.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span>{task.assignee}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(task.status)}>
                        <StatusIcon className={cn("mr-1 h-3.5 w-3.5", task.status === 'In Progress' && 'animate-spin')} />
                        {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(task.deadline), 'MMM d, yyyy')}</TableCell>
                </TableRow>
              );
            })}
             {!loading && tasks?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No tasks found.
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
