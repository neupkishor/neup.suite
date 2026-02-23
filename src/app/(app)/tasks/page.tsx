'use client';
import {
  collection,
  CollectionReference,
  query,
  where,
} from 'firebase/firestore';
import {
  Download,
  PlusCircle,
  CheckCircle2,
  Clock,
  ListTodo
} from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

import { useCollection } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { type Task } from '@/schemas/task';
import { TaskCard } from './components/task-card';
import Cookies from 'js-cookie';
import type { Client } from '@/schemas/client';
import Link from 'next/link';
import { CreateTaskLux } from './components/create-task-lux';
import { Card, CardContent } from '@/components/ui/card';

type Project = {
  id: string;
  name: string;
};

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

  const stats = useMemo(() => {
      if (!tasks) return { total: 0, pending: 0, done: 0 };
      return {
          total: tasks.length,
          pending: tasks.filter(t => t.status !== 'Done' && t.status !== 'Cancelled').length,
          done: tasks.filter(t => t.status === 'Done').length
      };
  }, [tasks]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground mt-1">
             {clientId ? 'Manage tasks for the selected client.' : 'Stay on top of your work.'}
          </p>
        </div>
         <Button variant="ghost" size="sm" asChild>
            <Link href="/tasks/import" className="text-muted-foreground hover:text-foreground"><Download className="mr-2 h-4 w-4" /> Import</Link>
          </Button>
      </div>

      <div className="space-y-4">
        {/* Card 1: Create Task */}
        <CreateTaskLux 
            projects={projects} 
            clients={clients} 
            clientId={clientId}
        />

        {/* Card 2: Status & List */}
        <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
             {/* Status Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 font-medium">
                        <ListTodo className="h-4 w-4 text-muted-foreground" />
                        <span>{stats.total} Tasks</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{stats.pending} Pending</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{stats.done} Done</span>
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="divide-y">
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
                
                {!loading && tasks?.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
                            <PlusCircle className="h-6 w-6 text-muted-foreground" />
                        </div>
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No tasks yet</h3>
                    <p className="mt-1">Add a task above to get started.</p>
                </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
