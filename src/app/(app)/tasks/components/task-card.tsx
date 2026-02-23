'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
  Calendar as CalendarIconLucide,
  Trash2,
  AlignLeft,
  Briefcase,
  User,
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
import { format } from 'date-fns';
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
  'To Do': { icon: Circle, color: 'text-muted-foreground hover:text-foreground' },
  'In Progress': { icon: Loader2, color: 'text-primary' },
  Done: { icon: CheckCircle2, color: 'text-primary' },
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
  clientName,
}: {
  task: Task & { id: string };
  projects: Project[] | null;
  clientName?: string;
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
    <div className="group flex flex-col gap-1 py-3 px-4 hover:bg-muted/30 transition-colors border-b last:border-0">
      <div className="flex items-start gap-3">
        {/* Status Checkbox */}
        <button
          className={cn(
            "mt-1 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
             statusConfig[task.status].color
          )}
          onClick={(e) => {
            e.stopPropagation();
            const newStatus = task.status === 'Done' ? 'To Do' : 'Done';
            handleStatusChange(newStatus);
          }}
        >
          <StatusIcon
            className={cn(
              'h-5 w-5',
              task.status === 'In Progress' && 'animate-spin'
            )}
          />
        </button>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="flex items-start justify-between gap-4">
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
                        className={cn('h-auto p-0 border-0 text-base font-medium shadow-none focus-visible:ring-0', task.status === 'Done' && 'line-through text-muted-foreground')}
                    />
                ) : (
                    <p
                        onClick={() => setIsEditingTitle(true)}
                        className={cn(
                            'font-medium cursor-pointer text-base break-words',
                            task.status === 'Done' && 'line-through text-muted-foreground'
                        )}
                        >
                        {task.title}
                    </p>
                )}
                
                {/* Delete Button (Visible on Hover) */}
                 <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mr-2"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                    }}
                >
                    <Trash2 className="text-muted-foreground hover:text-destructive h-4 w-4" />
                </Button>
            </div>

            {/* Description */}
             {isEditingDescription ? (
                 <Textarea
                    ref={descriptionInputRef}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={handleDescriptionUpdate}
                    onKeyDown={(e) => { if (e.key === 'Escape') setIsEditingDescription(false) }}
                    placeholder="Add details..."
                    className="text-sm mt-1 p-0 border-0 h-auto shadow-none focus-visible:ring-0 min-h-[60px] resize-none"
                />
             ) : task.description ? (
                <div onClick={() => setIsEditingDescription(true)} className="flex items-start gap-2 mt-1 cursor-pointer group/desc">
                    <AlignLeft className="h-3.5 w-3.5 text-muted-foreground/70 mt-0.5" />
                    <p className="text-muted-foreground text-sm group-hover/desc:text-foreground transition-colors line-clamp-2">
                        {task.description}
                    </p>
                </div>
             ) : null}

            {/* Subtasks */}
            {task.subtasks && task.subtasks.length > 0 && (
                <div className="space-y-1 pt-2">
                    {task.subtasks.map((subtask, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                             <Checkbox 
                                className="h-3.5 w-3.5"
                                checked={subtask.completed} 
                                onCheckedChange={(checked) => handleSubtaskChange(index, !!checked)} 
                            />
                            <span className={cn(subtask.completed && 'line-through')}>{subtask.text}</span>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Meta Chips */}
            <div className="flex items-center gap-2 pt-2 flex-wrap">
                 {/* Add Description Trigger if empty */}
                 {!isEditingDescription && !task.description && (
                    <button 
                        onClick={() => setIsEditingDescription(true)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted px-2 py-0.5 rounded-full"
                    >
                        <AlignLeft className="h-3 w-3" />
                        <span>Details</span>
                    </button>
                )}

                {/* Date Chip */}
                <Popover>
                    <PopoverTrigger asChild>
                    <button
                        className={cn(
                            "flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors border",
                            task.deadline 
                                ? "bg-background border-border text-foreground hover:bg-muted" 
                                : "opacity-0 group-hover:opacity-100 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <CalendarIconLucide className="h-3 w-3" />
                        <span>
                        {task.deadline
                            ? format(new Date(task.deadline), 'MMM d')
                            : 'Date'}
                        </span>
                    </button>
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

                {/* Assignees Chip */}
                 {task.assignees && task.assignees.length > 0 && (
                    <div className="flex items-center gap-1 bg-background border border-border px-2 py-0.5 rounded-full text-[10px] font-medium text-foreground">
                         <User className="h-3 w-3" />
                         <span>{task.assignees.length}</span>
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
