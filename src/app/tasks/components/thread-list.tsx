'use client';

import { format } from 'date-fns';
import { Thread, Project, Client } from '@/generated/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, User, Clock, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { USERS } from '@/lib/users';

interface ThreadListProps {
  threads: Thread[];
  projects: Project[];
  clients: Client[];
}

export function ThreadList({ threads, projects, clients }: ThreadListProps) {
  const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || id;
  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || id;
  const getUserName = (id: string) => USERS.find(u => u.username === id)?.name || id;

  const formatContent = (content: string) => {
    // Hide lines starting with --
    let formatted = content.split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');

    // Replace @on.[project-name]
    formatted = formatted.replace(/@on\.([a-zA-Z0-9-]+)/g, (match, name) => {
      // The name in command is hyphenated, we might want to display it nicer
      // But we don't have the original name here unless we lookup by ID which we don't have
      // Wait, the regex captures the name directly now? 
      // In parseThreadContent we used ID for storage, but here we display the text content?
      // Actually, the content stored in DB still has the raw text commands.
      // So @on.my-project will be in the text.
      return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Project: ${name.replace(/-/g, ' ')}</span>`;
    });

    // Replace @for.[client]
    formatted = formatted.replace(/@for\.([a-zA-Z0-9-]+)/g, (match, name) => {
      return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Client: ${name.replace(/-/g, ' ')}</span>`;
    });

    // Replace @[username]
    formatted = formatted.replace(/@\[([a-zA-Z0-9._-]+)\]/g, (match, username) => {
      const name = getUserName(username);
      return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">@${name}</span>`;
    });

    // Replace @assign.[username]
    formatted = formatted.replace(/@assign\.([a-zA-Z0-9._-]+)/g, (match, username) => {
        const name = getUserName(username);
        return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">Assigned: ${name}</span>`;
    });

    // Replace @by.[deadline]
    formatted = formatted.replace(/@by\.([a-zA-Z0-9-]+)/g, (match, value) => {
      return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">Due: ${value}</span>`;
    });

    // Replace @set.[status]
    formatted = formatted.replace(/@set\.([a-zA-Z0-9-_]+)/g, (match, value) => {
      return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Status: ${value}</span>`;
    });

    return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  const formatDateSafe = (dateStr: string, formatStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return format(date, formatStr);
    } catch (e) {
      return 'Invalid Date';
    }
  };

  if (threads.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No updates yet. Start a discussion below.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <Card key={thread.id} className="border-l-4 border-l-primary/20">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="font-medium">User</span>
                <span>•</span>
                <Clock className="w-3 h-3" />
                <span>{format(new Date(thread.created_at), 'MMM d, h:mm a')}</span>
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-foreground">
              {formatContent(thread.description)}
            </div>

            {/* Display Updates from more_info */}
            {thread.more_info && thread.more_info.length > 0 && (
              <div className="mt-4 pt-4 border-t space-y-2">
                {thread.more_info.map((info, idx) => {
                  const separatorIndex = info.indexOf(':');
                  if (separatorIndex === -1) return null;
                  
                  const key = info.substring(0, separatorIndex);
                  const value = info.substring(separatorIndex + 1);
                  
                  if (key === 'statusFrom') {
                    const nextInfo = thread.more_info[idx + 1];
                    if (nextInfo && nextInfo.startsWith('statusTo:')) {
                      const nextValue = nextInfo.substring(nextInfo.indexOf(':') + 1);
                      return (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <AlertCircle className="w-3 h-3" />
                          <span>Status changed:</span>
                          <Badge variant="outline">{value}</Badge>
                          <ArrowRight className="w-3 h-3" />
                          <Badge>{nextValue}</Badge>
                        </div>
                      );
                    }
                  }

                  if (key === 'deadlineFrom') {
                    const nextInfo = thread.more_info[idx + 1];
                    if (nextInfo && nextInfo.startsWith('deadlineTo:')) {
                       const nextValue = nextInfo.substring(nextInfo.indexOf(':') + 1);
                       return (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>Deadline changed:</span>
                          <span className="line-through">{value === 'none' ? 'None' : formatDateSafe(value, 'MMM d, yyyy')}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span className="font-medium">{formatDateSafe(nextValue, 'MMM d, yyyy')}</span>
                        </div>
                      );
                    }
                  }

                  if (key === 'assigned') {
                    return (
                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>Assigned to:</span>
                        <Badge variant="secondary">{getUserName(value)}</Badge>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
