'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
    Briefcase, 
    Loader2, 
    Plus, 
    Check,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from '@/components/ui/form';
import { MentionInput } from './mention-input';
import { cn } from '@/lib/utils';
import { addTask } from '@/actions/tasks/add-task';
import { taskSchema } from '@/schemas/task';
import type { Client } from '@/generated/prisma';
import type { Project } from '@/generated/prisma';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

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
  const [activeTray, setActiveTray] = useState<'client' | null>(null);
  const [showDescription, setShowDescription] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'To Do',
      assignees: [],
      subtasks: [],
      clientId: clientId || '',
    },
  });

  const { watch, setValue } = form;
  const selectedClientId = watch('clientId');

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    setIsSubmitting(true);
    
    try {
      await addTask(values);
      
      form.reset({
        title: '',
        description: '',
        status: 'To Do',
        assignees: [],
        subtasks: [],
        clientId: clientId || '',
      });
      setIsExpanded(false);
      setShowDescription(false);
      setActiveTray(null); 
      toast({
        title: 'Task created',
        description: 'Your task has been added successfully.',
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to add task', error);
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
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
          setShowDescription(true);
          // Small timeout to allow render
          setTimeout(() => {
              const descriptionField = containerRef.current?.querySelector('textarea');
              if (descriptionField instanceof HTMLTextAreaElement) {
                  descriptionField.focus();
              }
          }, 0);
      }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (!form.getValues('title') && !isSubmitting) {
          setIsExpanded(false);
          setShowDescription(false);
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

  const toggleTray = (tray: 'client') => {
      setActiveTray(current => current === tray ? null : tray);
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
                        <div className={cn("flex items-center gap-3 p-3", isExpanded ? "pb-0" : "")}>
                            <motion.div 
                                layout="position"
                                className={cn(
                                    "flex items-center justify-center rounded-full transition-colors duration-300 h-6 w-6 border-2 border-muted-foreground/30 text-muted-foreground group-hover:border-primary/50 shrink-0",
                                    isExpanded && "bg-primary/10 text-primary border-transparent"
                                )}
                            >
                                <Plus className="h-4 w-4" />
                            </motion.div>
                            
                            <div className="flex-1 min-w-0">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <MentionInput 
                                                    singleLine
                                                    projects={projects || []}
                                                    clients={clients || []}
                                                    className={cn(
                                                        "border-0 px-0 focus-visible:ring-0 shadow-none py-0 bg-transparent transition-all duration-300 focus:outline-none focus:ring-0 focus-visible:ring-offset-0",
                                                        isExpanded ? "text-3xl h-14 font-bold placeholder:text-muted-foreground/40" : "h-auto text-lg font-medium placeholder:text-muted-foreground cursor-pointer"
                                                    )}
                                                    placeholder={isExpanded ? "What needs to be done?" : "Add a new task..."}
                                                    readOnly={!isExpanded}
                                                    {...field} 
                                                    onKeyDown={(e) => {
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
                                    <div className="px-4 pb-4 pt-2">
                                        {/* Description - Only show if user hit Enter on title or if there is content */}
                                        {showDescription && (
                                            <div className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="description"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <MentionInput
                                                                placeholder="Add extra details, notes, links, or assign via @..."
                                                                className="min-h-[60px] text-sm border-0 focus:ring-0 focus:outline-none shadow-none resize-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                value={field.value || ''}
                                                                onChange={field.onChange}
                                                                projects={projects || []}
                                                                clients={clients || []}
                                                            />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        )}
                                        
                                        {/* Control Deck (Now Above Trays) */}
                                        <div className={cn("flex items-center justify-between pt-1", showDescription ? "mt-4 pt-4" : "")}>
                                            <div className="flex items-center gap-2">
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
                                            {activeTray === 'client' && (
                                                <motion.div
                                                    key="client-tray"
                                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                                    className="bg-muted/30 rounded-xl p-3 mt-2"
                                                >
                                                    <div className="flex flex-wrap gap-2">
                                                        {clients?.map((client) => (
                                                            <button
                                                                key={client.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setValue('clientId', client.id);
                                                                    setActiveTray(null);
                                                                }}
                                                                className={cn(
                                                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                                                                    selectedClientId === client.id
                                                                        ? "bg-primary text-primary-foreground border-primary"
                                                                        : "bg-background border-border hover:border-primary/50 text-foreground"
                                                                )}
                                                            >
                                                                <Briefcase className="h-3 w-3" />
                                                                {client.name}
                                                            </button>
                                                        ))}
                                                    </div>
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
