import { addDays, format, parseISO } from 'date-fns';

export interface ParsedContent {
  references: string[];
  assigned_to: string[];
  mentioned_users: string[];
  deadline?: Date;
  status?: string;
  priority?: string;
  labels: string[];
  tags: string[];
  cleanContent: string;
}

export const parseThreadContent = (content: string): ParsedContent => {
  const references: string[] = [];
  const assigned_to: string[] = [];
  const mentioned_users: string[] = [];
  const labels: string[] = [];
  const tags: string[] = [];
  let deadline: Date | undefined;
  let status: string | undefined;
  let priority: string | undefined;

  // Regex for Project Selection: @on.[project-name]
  const projectRegex = /@on\.([a-zA-Z0-9-]+)/g;
  let match;
  while ((match = projectRegex.exec(content)) !== null) {
    references.push(`project.id.${match[1]}`);
  }

  // Regex for Client Selection: @for.[client]
  const clientRegex = /@for\.([a-zA-Z0-9-]+)/g;
  while ((match = clientRegex.exec(content)) !== null) {
    references.push(`client.id.${match[1]}`);
  }

  // Regex for User Mentions: @[username] or @username
  // Support both @[username] and @username
  const mentionRegex = /@\[?([a-zA-Z0-9._-]+)\]?/g;
  
  // We need to be careful not to match command prefixes like @on. @for. @by. @assign. @set. @deadline.
  // So we'll skip matches that start with these reserved words if they are followed by a dot.
  const reservedPrefixes = ['on', 'for', 'by', 'assign', 'set', 'deadline'];
  
  let tempMatch;
  while ((tempMatch = mentionRegex.exec(content)) !== null) {
    const captured = tempMatch[1];
    const isReservedCommand = reservedPrefixes.some(prefix => 
      captured === prefix || captured.startsWith(`${prefix}.`)
    );
    
    if (!isReservedCommand) {
        if (!reservedPrefixes.some(p => captured.startsWith(p + '.'))) {
             mentioned_users.push(captured);
        }
    }
  }

  // Regex for User Assignments: @assign.[username] or @assign.username
  const assignRegex = /@assign\.([a-zA-Z0-9._-]+)/g;
  while ((match = assignRegex.exec(content)) !== null) {
    assigned_to.push(match[1]);
    if (!mentioned_users.includes(match[1])) {
        mentioned_users.push(match[1]);
    }
  }

  // Regex for Deadline: @by.[deadline] or @deadline.[deadline]
  const deadlineRegex = /@(by|deadline)\.([a-zA-Z0-9-]+)/g;
  while ((match = deadlineRegex.exec(content)) !== null) {
    const value = match[2].toLowerCase();
    const today = new Date();
    
    if (value === 'today') {
      deadline = today;
    } else if (value === 'tomorrow') {
      deadline = addDays(today, 1);
    } else if (value === 'next-week') {
      deadline = addDays(today, 7);
    } else if (value.endsWith('days')) {
      const daysValue = parseInt(value.replace('days', ''));
      if (!isNaN(daysValue)) {
        deadline = addDays(today, daysValue);
      }
    } else {
      // Try parsing date YYYY-MM-DD
      try {
        const parsed = parseISO(value);
        if (!isNaN(parsed.getTime())) {
          deadline = parsed;
        }
      } catch (e) {
        console.error('Invalid date format', value);
      }
    }
  }

  // Regex for Status: @set.[status]
  const statusRegex = /@set\.([a-zA-Z0-9-_]+)/g;
  while ((match = statusRegex.exec(content)) !== null) {
    status = match[1];
  }

  // --- DASH COMMANDS ---
  
  // Regex for Priority: --priority [value] or --p [value]
  const priorityRegex = /--(priority|p)\s+([a-zA-Z0-9-]+)/g;
  while ((match = priorityRegex.exec(content)) !== null) {
    priority = match[2].toLowerCase();
  }

  // Regex for Labels: --label [value]
  const labelRegex = /--label\s+([a-zA-Z0-9-]+)/g;
  while ((match = labelRegex.exec(content)) !== null) {
    labels.push(match[1]);
  }

  // Regex for Tags: --tag [value]
  const tagRegex = /--tag\s+([a-zA-Z0-9-]+)/g;
  while ((match = tagRegex.exec(content)) !== null) {
    tags.push(match[1]);
  }

  // Generate clean content by removing all commands
  let cleanContent = content
    .replace(projectRegex, '')
    .replace(clientRegex, '')
    .replace(assignRegex, '')
    .replace(deadlineRegex, '')
    .replace(statusRegex, '')
    .replace(priorityRegex, '')
    .replace(labelRegex, '')
    .replace(tagRegex, '')
    .trim();

  return {
    references,
    assigned_to,
    mentioned_users,
    deadline,
    status,
    priority,
    labels,
    tags,
    cleanContent
  };
};
