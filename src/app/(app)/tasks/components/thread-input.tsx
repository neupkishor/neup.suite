'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createThread } from '@/actions/threads/create-thread';
import { Project, Client } from '@/generated/prisma';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { MentionInput } from './mention-input';

interface ThreadInputProps {
  parentId?: string;
  parentType?: 'task' | 'discussion';
  projects: Project[];
  clients: Client[];
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit?: (content: string) => Promise<void>;
}

export function ThreadInput({ 
    parentId, 
    parentType, 
    projects, 
    clients, 
    placeholder, 
    className,
    value: controlledValue,
    onChange: controlledOnChange,
    onSubmit: controlledOnSubmit
}: ThreadInputProps) {
  const [internalContent, setInternalContent] = useState('');
  
  const isControlled = controlledValue !== undefined;
  const content = isControlled ? controlledValue : internalContent;
  
  const setContent = (val: string) => {
    if (!isControlled) {
        setInternalContent(val);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      if (controlledOnSubmit) {
          await controlledOnSubmit(content);
      } else if (parentId && parentType) {
          const result = await createThread({
            description: content,
            parent_type: parentType,
            parent_id: parentId,
          });

          if (result.success) {
            if (!isControlled) setInternalContent('');
            toast({
              title: 'Update added',
              description: 'Your update has been posted successfully.',
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Failed to post update.',
            });
          }
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (controlledOnChange) {
        controlledOnChange(e);
    } else {
        setInternalContent(e.target.value);
    }
  };

  return (
    <div className={cn("relative space-y-2", className)}>
      <div className="relative">
        <MentionInput
            value={content}
            onChange={handleChange}
            placeholder={placeholder || "Type your update... (Cmd+Enter to submit)"}
            className={cn("pr-12", className)}
            projects={projects}
            clients={clients}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleSubmit();
                }
            }}
        />
        <div className="absolute bottom-2 right-2 z-10">
          <Button 
            type="button"
            size="icon" 
            variant="ghost" 
            onClick={handleSubmit} 
            disabled={isLoading || !content.trim()}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
