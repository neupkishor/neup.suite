'use client';

import {
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
  Calendar as CalendarIconLucide,
  AlignLeft,
  Briefcase,
  User,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Task } from '@/generated/prisma';
import type { Project } from '@/generated/prisma';
import type { Subtask } from '@/generated/prisma';

const statusConfig = {
  'To Do': { icon: Circle, color: 'text-muted-foreground hover:text-foreground' },
  'In Progress': { icon: Loader2, color: 'text-primary' },
  Done: { icon: CheckCircle2, color: 'text-primary' },
  Cancelled: { icon: XCircle, color: 'text-destructive' },
};

export function TaskCard({
  task,
  projects,
  clientName,
}: {
  task: Task & { subtasks: Subtask[] };
  projects: Project[] | null;
  clientName?: string;
}) {
  // Status mapping
  const getUiStatus = (status: string): keyof typeof statusConfig => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'Done';
      case 'done': return 'Done';
      case 'in-progress': return 'In Progress';
      case 'cancelled': return 'Cancelled';
      default: return 'To Do';
    }
  };
  const uiStatus = getUiStatus(task.status || 'pending');
  const StatusIcon = statusConfig[uiStatus]?.icon || Circle;
  
  // Extract projectId from references
  const projectIdRef = task.references.find((r: string) => r.startsWith('project.id.'));
  const projectId = projectIdRef ? projectIdRef.split('.')[2] : null;
  const project = projects?.find((p) => p.id === projectId);

  return (
    <div className="group flex flex-col gap-1 py-3 px-4 hover:bg-muted/30 transition-colors border-b last:border-0">
      <div className="flex items-start gap-3">
        {/* Status Icon (Read-only) */}
        <div
          className={cn(
            "mt-1 rounded-full flex items-center justify-center",
             statusConfig[uiStatus].color
          )}
        >
          <StatusIcon
            className={cn(
              'h-5 w-5',
              uiStatus === 'In Progress' && 'animate-spin'
            )}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="flex items-start justify-between gap-4">
                <Link href={`/threads/${task.id}`} className="block flex-1">
                    <p
                        className={cn(
                            'font-medium text-base break-words hover:underline',
                            uiStatus === 'Done' && 'line-through text-muted-foreground'
                        )}
                        >
                        {task.title}
                    </p>
                </Link>
            </div>

            {/* Description (Read-only) */}
             {task.description ? (
                <div className="flex items-start gap-2 mt-1">
                    <AlignLeft className="h-3.5 w-3.5 text-muted-foreground/70 mt-0.5 shrink-0" />
                    <p className="text-muted-foreground text-sm line-clamp-2">
                        {task.description.split('\n').filter(line => !line.trim().startsWith('--')).join(' ')}
                    </p>
                </div>
             ) : null}

            {/* Subtasks (Read-only) */}
            {task.subtasks && task.subtasks.length > 0 && (
                <div className="space-y-1 pt-2">
                    {task.subtasks.map((subtask, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                             <div className={cn("h-3.5 w-3.5 border rounded-sm flex items-center justify-center", subtask.completed ? "bg-primary border-primary" : "border-muted-foreground")}>
                                {subtask.completed && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                             </div>
                            <span className={cn(subtask.completed && 'line-through')}>{subtask.text}</span>
                        </div>
                    ))}
                </div>
            )}
            
                {/* Meta Chips */}
            <div className="flex items-center gap-2 pt-2 flex-wrap">
                {/* Date Chip (Read-only) */}
                {task.deadline && (
                    <div
                        className={cn(
                            "flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full border bg-background border-border text-foreground"
                        )}
                    >
                        <CalendarIconLucide className="h-3 w-3" />
                        <span>
                            {format(new Date(task.deadline), 'MMM d')}
                        </span>
                    </div>
                )}

                {/* Assignees Chip */}
                 {task.assigned_to && task.assigned_to.length > 0 && (
                    <div className="flex items-center gap-1 bg-background border border-border px-2 py-0.5 rounded-full text-[10px] font-medium text-foreground">
                         <User className="h-3 w-3" />
                         {task.assigned_to.map((userId) => (
                             <span key={userId} className="text-[10px]">{userId}</span>
                         ))}
                    </div>
                )}
                
                {/* Client Chip */}
                {clientName && (
                     <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-medium">
                        <Briefcase className="h-3 w-3" />
                        <span className="max-w-[100px] truncate">{clientName}</span>
                     </div>
                )}

                 {/* Project Chip */}
                 {project && (
                    <div className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full text-[10px] font-medium text-muted-foreground">
                        {project.name}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
