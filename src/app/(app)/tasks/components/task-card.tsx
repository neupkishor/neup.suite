
'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Circle,
  Loader2,
  XCircle,
  Calendar as CalendarIconLucide,
  Trash2,
  AlignLeft,
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
import { Textarea } from '@/components/ui/textarea';

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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');

  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const firestore = useFirestore();

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingDescription && descriptionInputRef.current) {
        descriptionInputRef.current.focus();
    }
  }, [isEditingDescription]);

  const StatusIcon = statusConfig[task.status]?.icon || Circle;
  const project = projects?.find((p) => p.id === task.project);

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
  };

  const handleSubtaskChange = async (
    subtaskIndex: number,
    completed: boolean
  ) => {
    if (!firestore) return;
    const newSubtasks = [...(task.subtasks || [])];
    newSubtasks[subtaskIndex] = { ...newSubtasks[subtaskIndex], completed };
    try {
      await updateTask(firestore, task.id, { subtasks: newSubtasks });
    } catch (error) {
      console.error('Failed to update subtask', error);
    }
  };

  const handleTitleUpdate = async () => {
    if (!firestore || title === task.title) {
        setIsEditingTitle(false);
        return;
    };
    try {
        await updateTask(firestore, task.id, { title });
        setIsEditingTitle(false);
    } catch (error) {
        console.error('Failed to update title', error);
    }
  };

  const handleDescriptionUpdate = async () => {
    if (!firestore || description === task.description) {
        setIsEditingDescription(false);
        return;
    };
     try {
        await updateTask(firestore, task.id, { description });
        setIsEditingDescription(false);
    } catch (error) {
        console.error('Failed to update description', error);
    }
  }


  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 h-6 w-6 mt-0.5"
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
          {isEditingTitle ? (
             <Input
                ref={titleInputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleUpdate}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleUpdate();
                    if (e.key === 'Escape') setIsEditingTitle(false);
                }}
                className={cn('h-auto p-0 border-0 text-base', task.status === 'Done' && 'line-through text-muted-foreground')}
            />
          ) : (
             <p
                onClick={() => setIsEditingTitle(true)}
                className={cn(
                    'font-medium cursor-pointer text-base',
                    task.status === 'Done' && 'line-through text-muted-foreground'
                )}
                >
                {task.title}
            </p>
          )}
           {isEditingDescription ? (
             <Textarea
                ref={descriptionInputRef}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionUpdate}
                onKeyDown={(e) => { if (e.key === 'Escape') setIsEditingDescription(false) }}
                placeholder="Add description..."
                className="text-sm mt-1 p-0 border-0 h-auto"
            />
         ) : task.description ? (
            <div onClick={() => setIsEditingDescription(true)} className="flex items-start gap-2 mt-1 cursor-pointer group">
                <AlignLeft className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground text-sm group-hover:text-foreground">
                {task.description}
                </p>
            </div>
         ) : null}

        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <Trash2 className="text-destructive h-4 w-4" />
        </Button>
      </div>
      <div className="pl-9 space-y-3">
         {task.subtasks && task.subtasks.length > 0 && (
            <div className="space-y-2 pt-2">
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

        <div className="flex items-center gap-2 pt-1 flex-wrap">
            {project && (
                <div className="text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-md">{project.name}</div>
            )}
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
                    className="h-6 w-6 border-2 border-card"
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
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn("h-auto px-2 py-1 text-xs", task.deadline && "text-primary")}
                >
                    <CalendarIconLucide className="mr-1.5 h-3 w-3" />
                    <span>
                    {task.deadline
                        ? format(new Date(task.deadline), 'MMM d')
                        : 'No date'}
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
             {!isEditingDescription && !task.description && (
                <Button variant="ghost" className="text-muted-foreground h-auto px-2 py-1 text-xs" size="sm" onClick={() => setIsEditingDescription(true)}>
                    <AlignLeft className="h-3 w-3 mr-1.5"/>
                    Add description
                </Button>
            )}
        </div>
      </div>
    </div>
  );
}

    