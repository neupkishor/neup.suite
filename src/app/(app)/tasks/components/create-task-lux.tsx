
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addDays, nextMonday, isSameDay, isValid, parse } from 'date-fns';
import { 
    Calendar as CalendarIcon, 
    User, 
    Briefcase, 
    Loader2, 
    Plus, 
    Check,
    Clock,
    Users,
    X,
    Sun,
    CalendarDays
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase/provider';
import { addTask } from '../actions/add-task';
import { taskSchema } from '@/schemas/task';
import type { Client } from '@/schemas/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

interface CreateTaskLuxProps {
  projects: Project[] | null;
  clients: Client[] | null;
  clientId?: string | null;
}

export function CreateTaskLux({
  projects,
  clients,
  clientId,
}: CreateTaskLuxProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTray, setActiveTray] = useState<'assignee' | 'date' | 'client' | null>(null);
  const [customDate, setCustomDate] = useState('');
  const firestore = useFirestore();
  const containerRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'To Do',
      assignees: ['Jane Doe'],
      subtasks: [],
      clientId: clientId || '',
    },
  });

  const { watch, setValue } = form;
  const assignees = watch('assignees');
  const deadline = watch('deadline');
  const selectedClientId = watch('clientId');

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);
    
    try {
      await addTask(firestore, {
        ...values,
        deadline: values.deadline
          ? format(values.deadline, 'yyyy-MM-dd')
          : null,
      }, 'user_placeholder');
      
      form.reset();
      setIsExpanded(false);
      setActiveTray(null); 
      setCustomDate('');
    } catch (error) {
      console.error('Failed to add task', error);
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          const descriptionField = containerRef.current?.querySelector('textarea');
          if (descriptionField instanceof HTMLTextAreaElement) {
              descriptionField.focus();
          }
      }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (!form.getValues('title') && !isSubmitting) {
          setIsExpanded(false);
          setActiveTray(null);
        }
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, isSubmitting, form]);

  const toggleTray = (tray: 'assignee' | 'date' | 'client') => {
      setActiveTray(current => current === tray ? null : tray);
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setCustomDate(val);
      const parsedDate = parse(val, 'yyyy-MM-dd', new Date());
      if (isValid(parsedDate) && val.length === 10) {
          setValue('deadline', parsedDate);
      }
  };

  return (
    <motion.div
        layout
        ref={containerRef}
        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        className={cn(
            "w-full bg-background rounded-2xl border transition-all duration-300 relative z-20 overflow-hidden",
            isExpanded 
                ? "shadow-lg ring-1 ring-primary/5 scale-[1.005]" 
                : "shadow-sm hover:shadow hover:border-primary/20 cursor-pointer"
        )}
        onClick={() => !isExpanded && setIsExpanded(true)}
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
                <motion.div layout className="p-1">
                    <div className="flex flex-col">
                        {/* Header / Title Area */}
                        <div className={cn("flex items-start gap-3 p-3", isExpanded ? "pb-0" : "")}>
                            <motion.div 
                                layout
                                className={cn(
                                    "flex items-center justify-center rounded-full transition-colors duration-300",
                                    isExpanded ? "mt-1 h-8 w-8 bg-primary/10 text-primary" : "h-6 w-6 border-2 border-muted-foreground/30 text-muted-foreground group-hover:border-primary/50"
                                )}
                            >
                                {isExpanded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </motion.div>
                            
                            <div className="flex-1 min-w-0">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input 
                                                    className={cn(
                                                        "border-0 px-0 focus-visible:ring-0 shadow-none h-auto py-0 bg-transparent transition-all duration-300",
                                                        isExpanded ? "text-xl font-semibold placeholder:text-muted-foreground/40" : "text-lg font-medium placeholder:text-muted-foreground cursor-pointer"
                                                    )}
                                                    placeholder={isExpanded ? "What needs to be done?" : "Add a new task..."}
                                                    readOnly={!isExpanded}
                                                    {...field} 
                                                    onKeyDown={(e) => {
                                                        field.onBlur();
                                                        handleTitleKeyDown(e);
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pb-4 pt-2 space-y-4">
                                        {/* Description */}
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Add extra details, notes, or links..."
                                                            className="resize-none border-0 px-0 focus-visible:ring-0 shadow-none min-h-[60px] text-muted-foreground/80 text-sm leading-relaxed"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        
                                        {/* Control Deck (Now Above Trays) */}
                                        <div className="flex items-center justify-between pt-1 border-t border-border/40 mt-4 pt-4">
                                            <div className="flex items-center gap-2">
                                                {/* Date Toggle */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    type="button"
                                                    onClick={() => toggleTray('date')}
                                                    className={cn(
                                                        "h-8 rounded-full px-3 text-xs font-medium transition-all hover:bg-muted",
                                                        (deadline || activeTray === 'date') ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground"
                                                    )}
                                                >
                                                    <Clock className="mr-2 h-3.5 w-3.5" />
                                                    {deadline ? format(deadline, 'MMM d') : "Due Date"}
                                                </Button>

                                                {/* Assignee Toggle */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    type="button"
                                                    onClick={() => toggleTray('assignee')}
                                                    className={cn(
                                                        "h-8 rounded-full px-3 text-xs font-medium transition-all hover:bg-muted",
                                                        (assignees.length > 0 || activeTray === 'assignee') ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground"
                                                    )}
                                                >
                                                    <Users className="mr-2 h-3.5 w-3.5" />
                                                    {assignees.length > 0 ? `${assignees.length} Assigned` : "Assign"}
                                                </Button>

                                                {/* Client Toggle */}
                                                {!clientId && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        type="button"
                                                        onClick={() => toggleTray('client')}
                                                        className={cn(
                                                            "h-8 rounded-full px-3 text-xs font-medium transition-all hover:bg-muted",
                                                            (selectedClientId || activeTray === 'client') ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground"
                                                        )}
                                                    >
                                                        <Briefcase className="mr-2 h-3.5 w-3.5" />
                                                        {clients?.find(c => c.id === selectedClientId)?.name || "Client"}
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsExpanded(false);
                                                        setActiveTray(null);
                                                    }}
                                                    className="h-8 rounded-full px-4 text-xs font-medium text-muted-foreground hover:text-foreground"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button 
                                                    type="submit" 
                                                    size="sm"
                                                    disabled={isSubmitting || !form.watch('title')}
                                                    className="h-8 rounded-full px-4 text-xs font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:-translate-y-0.5"
                                                >
                                                    {isSubmitting ? (
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    ) : (
                                                        <>Create Task <span className="ml-1 opacity-50 font-normal">↵</span></>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Selection Trays (Now Below Control Deck) */}
                                        <AnimatePresence mode="wait">
                                            {activeTray === 'date' && (
                                                <motion.div
                                                    key="date-tray"
                                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                                    className="bg-muted/30 rounded-xl p-3 flex flex-col gap-3 mt-2"
                                                >
                                                    <div className="flex gap-2 overflow-x-auto no-scrollbar items-center pb-1">
                                                        {[
                                                            { label: 'Today', date: new Date(), icon: Sun },
                                                            { label: 'Tomorrow', date: addDays(new Date(), 1), icon: CalendarDays },
                                                            { label: 'Next Week', date: nextMonday(new Date()), icon: CalendarIcon },
                                                        ].map((option) => (
                                                            <button
                                                                key={option.label}
                                                                type="button"
                                                                onClick={() => {
                                                                    setValue('deadline', option.date);
                                                                    setActiveTray(null);
                                                                }}
                                                                className={cn(
                                                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap",
                                                                    deadline && isSameDay(deadline, option.date)
                                                                        ? "bg-primary text-primary-foreground border-primary"
                                                                        : "bg-background border-border hover:border-primary/50 text-foreground"
                                                                )}
                                                            >
                                                                <option.icon className="h-3.5 w-3.5" />
                                                                {option.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                                                        <span className="text-xs text-muted-foreground whitespace-nowrap">Custom Date:</span>
                                                        <Input 
                                                            type="text" 
                                                            placeholder="YYYY-MM-DD" 
                                                            value={customDate}
                                                            onChange={handleCustomDateChange}
                                                            className="h-8 text-xs font-mono"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}

                                            {activeTray === 'assignee' && (
                                                <motion.div
                                                    key="assignee-tray"
                                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                                    className="bg-muted/30 rounded-xl p-3 flex gap-3 overflow-x-auto no-scrollbar items-center mt-2"
                                                >
                                                    {teamMembers.map((member) => (
                                                        <button
                                                            key={member.value}
                                                            type="button"
                                                            onClick={() => {
                                                                const current = assignees;
                                                                const next = current.includes(member.value)
                                                                    ? current.filter((v: string) => v !== member.value)
                                                                    : [...current, member.value];
                                                                setValue('assignees', next);
                                                            }}
                                                            className="group flex flex-col items-center gap-1.5 min-w-[60px]"
                                                        >
                                                            <div className={cn(
                                                                "h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all",
                                                                assignees.includes(member.value)
                                                                    ? "border-primary bg-primary/10"
                                                                    : "border-transparent bg-background group-hover:border-primary/30"
                                                            )}>
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.value}`} />
                                                                    <AvatarFallback>{member.label[0]}</AvatarFallback>
                                                                </Avatar>
                                                            </div>
                                                            <span className={cn(
                                                                "text-[10px] font-medium text-center truncate w-full transition-colors",
                                                                assignees.includes(member.value) ? "text-primary" : "text-muted-foreground"
                                                            )}>
                                                                {member.label.split(' ')[0]}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}

                                            {activeTray === 'client' && !clientId && (
                                                <motion.div
                                                    key="client-tray"
                                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                                    className="bg-muted/30 rounded-xl p-3 flex flex-wrap gap-2 mt-2"
                                                >
                                                    {clients?.map((client) => (
                                                        <button
                                                            key={client.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setValue('clientId', selectedClientId === client.id ? '' : client.id);
                                                                setActiveTray(null);
                                                            }}
                                                            className={cn(
                                                                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                                                                selectedClientId === client.id
                                                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                                                    : "bg-background border-border hover:border-primary/50 text-foreground"
                                                            )}
                                                        >
                                                            {client.name}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </form>
        </Form>
    </motion.div>
  );
}
