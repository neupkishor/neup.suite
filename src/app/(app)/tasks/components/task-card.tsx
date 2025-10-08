
'use client';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Circle,
  Loader2,
  XCircle,
  MoreHorizontal,
  GripVertical,
  Repeat,
  AlignLeft,
  Calendar as CalendarIconLucide,
  CalendarIcon,
  Trash2,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';
import { updateTask } from '../actions/update-task';
import { useFirestore } from '@/firebase/provider';
import { placeholderImages } from '@/lib/placeholder-images';
import type { Task } from '@/schemas/task';
import { deleteDoc, doc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';

type Project = {
  id: string;
  name: string;
};

const statusConfig = {
  'To Do': { icon: Circle, color: 'text-muted-foreground' },
  'In Progress': { icon: Loader2, color: 'text-primary' },
  Done: { icon: CheckCircle, color: 'text-chart-2' },
  Cancelled: { icon: XCircle, color: 'text-destructive' },
};

const teamMembers = [
  { value: 'Jane Doe', label: 'Jane Doe', avatarId: 'user-avatar' },
  { value: 'Alex Ray', label: 'Alex Ray', avatarId: 'contact-1' },
  { value: 'Jordan Smith', label: 'Jordan Smith', avatarId: 'contact-2' },
  { value: 'Casey Williams', label: 'Casey Williams', avatarId: 'contact-4' },
];

export function TaskCard({
  task,
  projects,
}: {
  task: Task & { id: string };
  projects: Project[] | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const StatusIcon = statusConfig[task.status]?.icon || Circle;
  const project = projects?.find((p) => p.id === task.project);
  const firestore = useFirestore();

  const handleStatusChange = async (newStatus: Task['status']) => {
    if (!firestore) return;
    try {
      await updateTask(firestore, task.id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  const handleDateChange = async (date: Date | null) => {
    if (!firestore) return;
    try {
      await updateTask(firestore, task.id, {
        deadline: date ? format(date, 'yyyy-MM-dd') : null,
      });
    } catch (error) {
      console.error('Failed to update deadline', error);
    }
  };

  const handleDelete = async () => {
    if (!firestore) return;
    if (window.confirm('Are you sure you want to delete this task?')) {
        try {
            await deleteDoc(doc(firestore, 'tasks', task.id));
        } catch (error) {
            console.error('Failed to delete task', error);
        }
    }
  }

  const handleSubtaskChange = async (subtaskIndex: number, completed: boolean) => {
    if (!firestore) return;
    const newSubtasks = [...(task.subtasks || [])];
    newSubtasks[subtaskIndex] = { ...newSubtasks[subtaskIndex], completed };
    try {
        await updateTask(firestore, task.id, { subtasks: newSubtasks });
    } catch (error) {
        console.error('Failed to update subtask', error);
    }
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-lg border transition-colors data-[state=open]:bg-muted/50"
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-start gap-4 p-4 cursor-pointer select-none">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-6 w-6 mt-1"
            onClick={(e) => {
              e.stopPropagation();
              const newStatus = task.status === 'Done' ? 'To Do' : 'Done';
              handleStatusChange(newStatus);
            }}
          >
            <StatusIcon
              className={cn(
                'h-5 w-5',
                statusConfig[task.status].color,
                task.status === 'In Progress' && 'animate-spin'
              )}
            />
          </Button>
          <div className="flex-1">
            <p
              className={cn(
                'font-medium',
                task.status === 'Done' && 'line-through text-muted-foreground'
              )}
            >
              {task.title}
            </p>
            {project && (
              <p className="text-sm text-muted-foreground">{project.name}</p>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {task.assignees?.map((assigneeName) => {
                const member = teamMembers.find((m) => m.value === assigneeName);
                if (!member) return null;
                const avatar = placeholderImages.find(
                  (p) => p.id === member.avatarId
                );
                return (
                  <Avatar
                    key={assigneeName}
                    className="h-6 w-6 border-2 border-background"
                  >
                    {avatar && (
                      <AvatarImage src={avatar.imageUrl} alt={assigneeName} />
                    )}
                    <AvatarFallback>
                      {assigneeName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
            {task.deadline && (
              <div className="flex items-center gap-1.5">
                <CalendarIconLucide className="h-4 w-4" />
                <span>{format(new Date(task.deadline), 'MMM d')}</span>
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
            <Trash2 className="text-destructive"/>
          </Button>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent
        className="overflow-hidden transition-all duration-300 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      >
        <div className="px-14 pb-4 space-y-4">
          {(task.description || (task.subtasks && task.subtasks.length > 0)) ? (
            <>
              {task.description && (
                <div className="flex items-start gap-3">
                  <AlignLeft className="h-5 w-5 text-muted-foreground mt-1" />
                  <p className="text-muted-foreground text-sm">
                    {task.description}
                  </p>
                </div>
              )}
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="space-y-2">
                  {task.subtasks.map((subtask, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox checked={subtask.completed} onCheckedChange={(checked) => handleSubtaskChange(index, !!checked)} />
                      <span className={cn(subtask.completed && 'line-through text-muted-foreground')}>{subtask.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No details for this task.
            </p>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDateChange(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDateChange(addDays(new Date(), 1))}
            >
              Tomorrow
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-auto justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>
                    {task.deadline
                      ? format(new Date(task.deadline), 'PPP')
                      : 'Pick a date'}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    task.deadline ? new Date(task.deadline) : undefined
                  }
                  onSelect={(day) => handleDateChange(day || null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
