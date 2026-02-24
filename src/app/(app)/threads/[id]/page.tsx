import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ThreadList } from '@/app/(app)/tasks/components/thread-list';
import { ThreadInput } from '@/app/(app)/tasks/components/thread-input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Calendar, Clock, User, Link as LinkIcon } from 'lucide-react';

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    notFound();
  }

  // Fetch threads for this task
  const threads = await prisma.thread.findMany({
    where: {
      parent_id: id,
      parent_type: 'task',
    },
    orderBy: {
      created_at: 'asc',
    },
  });

  // Fetch projects and clients for suggestions
  const projects = await prisma.project.findMany();
  const clients = await prisma.client.findMany();

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Task Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold">{task.title}</h1>
          <Badge variant={task.status === 'Completed' ? 'default' : 'secondary'}>
            {task.status || 'Pending'}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {task.deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Due {format(task.deadline, 'MMM d, yyyy')}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Created {format(task.created_on, 'MMM d, yyyy')}</span>
          </div>
        </div>

        {task.description && (
          <div className="text-lg text-muted-foreground whitespace-pre-wrap">
            {task.description.split('\n').filter(line => !line.trim().startsWith('--')).join('\n')}
          </div>
        )}

        {/* References and Assignees */}
        <div className="flex flex-wrap gap-2">
          {task.assigned_to.map((user) => (
            <Badge key={user} variant="outline" className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {user}
            </Badge>
          ))}
          {task.references.map((ref) => (
            <Badge key={ref} variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
              <LinkIcon className="w-3 h-3" />
              {ref.replace('project.id.', 'Project: ').replace('client.id.', 'Client: ')}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Threads Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Discussion & Updates</h2>
        
        <ThreadList threads={threads} projects={projects} clients={clients} />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Update</CardTitle>
          </CardHeader>
          <CardContent>
            <ThreadInput 
              parentId={task.id} 
              parentType="task"
              projects={projects}
              clients={clients}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
