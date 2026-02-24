import 'server-only';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Download, PlusCircle, ListTodo, Clock, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { prisma } from '@/lib/prisma';
import { CreateTaskLux } from '@/app/(app)/tasks/components/create-task-lux';
import { TaskCard } from '@/app/(app)/tasks/components/task-card';
import { Task, Project, Client, Subtask } from '@/generated/prisma';

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

export default async function TasksPage() {
  const cookieStore = await cookies();
  const clientId = cookieStore.get('client')?.value;

  // Parallel data fetching
  const [tasks, projects, clients] = await Promise.all([
    prisma.task.findMany({
      where: clientId ? {
        clientId: clientId
      } : undefined,
      orderBy: {
        created_on: 'desc',
      },
    }),
    prisma.project.findMany({
      orderBy: {
        created_on: 'desc',
      },
    }),
    prisma.client.findMany({
      orderBy: {
        name: 'asc',
      },
    }),
  ]);

  // Fetch subtasks manually since relations are removed
  const taskIds = tasks.map((t: Task) => t.id);
  const subtasks = await prisma.subtask.findMany({
    where: {
      taskId: {
        in: taskIds
      }
    }
  });

  // Attach subtasks to tasks (in memory)
  const tasksWithSubtasks = tasks.map((t: Task) => ({
    ...t,
    subtasks: subtasks.filter((s: Subtask) => s.taskId === t.id)
  }));

  const stats = {
    total: tasks.length,
    // Note: Task status is now a String, need to match exact string values or update logic
    pending: tasksWithSubtasks.filter((t: any) => t.status !== 'Done' && t.status !== 'Cancelled').length,
    done: tasksWithSubtasks.filter((t: any) => t.status === 'Done').length,
  };

  const getClientName = (cId: string) => {
    return clients.find((c: Client) => c.id === cId)?.name;
  };

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
          <Link href="/tasks/import" className="text-muted-foreground hover:text-foreground">
            <Download className="mr-2 h-4 w-4" /> Import
          </Link>
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
                {tasksWithSubtasks.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No tasks found. Create one to get started!
                    </div>
                ) : (
                    tasksWithSubtasks.map((task: any) => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            clientName={getClientName(task.clientId)}
                            projects={projects?.length ? projects : null}
                        />
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
