'use client';

import { useState, useRef, useEffect, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { USERS } from '@/lib/users';
import { Project, Client } from '@/generated/prisma';

export interface MentionInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    className?: string;
    singleLine?: boolean;
    projects?: Project[];
    clients?: Client[];
    disabled?: boolean;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    onSubmit?: () => void; // For Enter key in singleLine or Cmd+Enter in multiLine
    readOnly?: boolean;
}

type Suggestion = {
    id: string;
    label: string;
    value: string; // The text to insert
    type: 'user' | 'client' | 'project' | 'date' | 'status' | 'command';
    icon?: React.ReactNode;
};

export const MentionInput = forwardRef<HTMLTextAreaElement | HTMLInputElement, MentionInputProps>(({
    value,
    onChange,
    placeholder,
    className,
    singleLine = false,
    projects = [],
    clients = [],
    disabled,
    onKeyDown,
    onSubmit,
    readOnly
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [triggerInfo, setTriggerInfo] = useState<{ start: number, end: number, text: string } | null>(null);
    
    // Internal ref if not provided
    const internalRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLTextAreaElement | HTMLInputElement>) || internalRef;

    // Auto-resize for textarea
    useEffect(() => {
        if (!singleLine && inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    }, [value, singleLine]);

    // Handle suggestion logic
    useEffect(() => {
        if (!inputRef.current) return;
        
        const selectionStart = inputRef.current.selectionStart || 0;
        const textBeforeCursor = value.slice(0, selectionStart);
        
        // Find the last trigger (@ or --)
        const lastAt = textBeforeCursor.lastIndexOf('@');
        const lastDash = textBeforeCursor.lastIndexOf('--');
        
        let triggerIndex = -1;
        let triggerType: '@' | '--' | null = null;

        if (lastAt !== -1 && (lastDash === -1 || lastAt > lastDash)) {
            triggerIndex = lastAt;
            triggerType = '@';
        } else if (lastDash !== -1) {
            triggerIndex = lastDash;
            triggerType = '--';
        }

        if (triggerIndex !== -1) {
            // Check if there's a space before the trigger (or it's the start)
            const charBeforeTrigger = triggerIndex > 0 ? textBeforeCursor[triggerIndex - 1] : ' ';
            if (/\s/.test(charBeforeTrigger)) {
                const query = textBeforeCursor.slice(triggerIndex); 
                
                if (triggerType === '@') {
                    // Check for specific prefixes
                    if (query.startsWith('@assign.')) {
                        const search = query.slice(8).toLowerCase();
                        const filtered = USERS.filter(u => 
                            u.name.toLowerCase().includes(search) || 
                            u.username.toLowerCase().includes(search)
                        ).map(u => ({
                            id: u.id,
                            label: u.name,
                            value: `@assign.${u.username}`,
                            type: 'user' as const
                        }));
                        setSuggestions(filtered);
                        setIsOpen(filtered.length > 0);
                        setTriggerInfo({ start: triggerIndex, end: selectionStart, text: query });
                    } else if (query.startsWith('@for.')) {
                        const search = query.slice(5).toLowerCase();
                        const filtered = clients.filter(c => 
                            c.name.toLowerCase().includes(search)
                        ).map(c => ({
                            id: c.id,
                            label: c.name,
                            value: `@for.${c.name.replace(/\s+/g, '-').toLowerCase()}`,
                            type: 'client' as const
                        }));
                        setSuggestions(filtered);
                        setIsOpen(filtered.length > 0);
                        setTriggerInfo({ start: triggerIndex, end: selectionStart, text: query });
                    } else if (query.startsWith('@on.')) {
                        const search = query.slice(4).toLowerCase();
                        const filtered = projects.filter(p => 
                            p.name.toLowerCase().includes(search)
                        ).map(p => ({
                            id: p.id,
                            label: p.name,
                            value: `@on.${p.name.replace(/\s+/g, '-').toLowerCase()}`,
                            type: 'project' as const
                        }));
                        setSuggestions(filtered);
                        setIsOpen(filtered.length > 0);
                        setTriggerInfo({ start: triggerIndex, end: selectionStart, text: query });
                    } else if (query.startsWith('@set.')) {
                        const search = query.slice(5).toLowerCase();
                        const statuses = ['todo', 'in-progress', 'reviewing', 'completed', 'cancelled'];
                        const filtered = statuses.filter(s => 
                            s.includes(search)
                        ).map(s => ({
                            id: s,
                            label: s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' '),
                            value: `@set.${s}`,
                            type: 'status' as const
                        }));
                        setSuggestions(filtered);
                        setIsOpen(filtered.length > 0);
                        setTriggerInfo({ start: triggerIndex, end: selectionStart, text: query });
                    } else if (query.startsWith('@by.') || query.startsWith('@deadline.')) {
                        const prefix = query.startsWith('@by.') ? '@by.' : '@deadline.';
                        const search = query.slice(prefix.length).toLowerCase();
                        
                        // Base suggestions
                        let base: Suggestion[] = [
                            { id: 'today', label: 'Today', value: `${prefix}today`, type: 'date' },
                            { id: 'tomorrow', label: 'Tomorrow', value: `${prefix}tomorrow`, type: 'date' },
                            { id: 'next-week', label: 'Next Week', value: `${prefix}next-week`, type: 'date' },
                        ];

                        // Dynamic parsing
                        if (search.match(/^\d+$/)) {
                            if (search.length === 8) {
                                 // YYYYMMDD
                                 const y = search.slice(0, 4);
                                 const m = search.slice(4, 6);
                                 const d = search.slice(6, 8);
                                 const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
                                 const monthIndex = parseInt(m) - 1;
                                 if (monthIndex >= 0 && monthIndex < 12) {
                                     const month = monthNames[monthIndex];
                                     const formatted = `${y} ${month} ${parseInt(d)}`;
                                     base.unshift({ id: 'date-explicit', label: formatted, value: `${prefix}${search}`, type: 'date' });
                                 }
                            }
                            
                            // Also suggest hours/days for simple numbers
                            base.push({ id: 'hours', label: `${search} hours`, value: `${prefix}${search}h`, type: 'date' });
                            base.push({ id: 'days', label: `${search} days`, value: `${prefix}${search}d`, type: 'date' });
                            
                        } else {
                            // Complex duration patterns
                            const patterns = [
                                { regex: /^(\d+)h(\d+)m$/, label: (m: RegExpMatchArray) => `${m[1]} hours ${m[2]} minutes` },
                                { regex: /^(\d+)hour(\d+)min$/, label: (m: RegExpMatchArray) => `${m[1]} hours ${m[2]} minutes` },
                                { regex: /^(\d+)day(\d+)hour$/, label: (m: RegExpMatchArray) => `${m[1]} days ${m[2]} hours` },
                                { regex: /^(\d+)h$/, label: (m: RegExpMatchArray) => `${m[1]} hours` },
                                { regex: /^(\d+)d$/, label: (m: RegExpMatchArray) => `${m[1]} days` },
                            ];

                            for (const p of patterns) {
                                const match = search.match(p.regex);
                                if (match) {
                                    base.unshift({ 
                                        id: 'duration-explicit', 
                                        label: p.label(match), 
                                        value: `${prefix}${search}`, 
                                        type: 'date' 
                                    });
                                    break;
                                }
                            }
                        }
                        
                        // Simple filtering
                        const filtered = base.filter(s => s.label.toLowerCase().includes(search) || s.value.includes(search));
                        setSuggestions(filtered);
                        setIsOpen(filtered.length > 0);
                        setTriggerInfo({ start: triggerIndex, end: selectionStart, text: query });
                    } else if (!query.includes(' ') && !query.includes('.')) {
                        // Just "@" or "@something" (no dot yet) - Show users
                        const search = query.slice(1).toLowerCase();
                        const filtered = USERS.filter(u => 
                            u.name.toLowerCase().includes(search) || 
                            u.username.toLowerCase().includes(search)
                        ).map(u => ({
                            id: `user-${u.id}`,
                            label: u.username, // Only show username as requested
                            value: `@[${u.username}]`,
                            type: 'user' as const
                        }));
                        
                        setSuggestions(filtered);
                        setIsOpen(filtered.length > 0);
                        setTriggerInfo({ start: triggerIndex, end: selectionStart, text: query });
                    } else {
                        setIsOpen(false);
                    }
                } else if (triggerType === '--') {
                    const search = query.slice(2).toLowerCase();
                    const options = [
                        { id: 'priority', label: 'Priority', value: '--priority ', type: 'command' as const },
                        { id: 'p', label: 'P (Priority)', value: '--p ', type: 'command' as const },
                        { id: 'label', label: 'Label', value: '--label ', type: 'command' as const },
                        { id: 'tag', label: 'Tag', value: '--tag ', type: 'command' as const },
                    ];
                    
                    const filtered = options.filter(o => o.id.includes(search));
                    setSuggestions(filtered);
                    setIsOpen(filtered.length > 0);
                    setTriggerInfo({ start: triggerIndex, end: selectionStart, text: query });
                }
            } else {
                setIsOpen(false);
            }
        } else {
            setIsOpen(false);
            setTriggerInfo(null);
        }
    }, [value, projects, clients]);

    // Reset active index when suggestions change
    useEffect(() => {
        setActiveIndex(0);
    }, [suggestions]);

    const handleSelect = (suggestion: Suggestion) => {
        if (!triggerInfo || !inputRef.current) return;
        
        const beforeTrigger = value.slice(0, triggerInfo.start);
        const afterTrigger = value.slice(triggerInfo.end);
        
        const newValue = beforeTrigger + suggestion.value + (suggestion.type === 'command' ? '' : ' ') + afterTrigger;
        
        // Create synthetic event
        const event = {
            target: { value: newValue },
            currentTarget: { value: newValue }
        } as React.ChangeEvent<HTMLInputElement>;
        
        onChange(event);
        setIsOpen(false);
        
        // Restore focus and move cursor
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                const newCursorPos = beforeTrigger.length + suggestion.value.length + (suggestion.type === 'command' ? 0 : 1);
                inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    const handleKeyDownInternal = (e: React.KeyboardEvent) => {
        if (isOpen && suggestions.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex(prev => (prev + 1) % suggestions.length);
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
                return;
            }
            if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                handleSelect(suggestions[activeIndex]);
                return;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                setIsOpen(false);
                return;
            }
        }
        
        if (onKeyDown) {
            onKeyDown(e);
        }
        
        if (e.key === 'Enter' && !e.shiftKey && singleLine && onSubmit) {
            e.preventDefault();
            onSubmit();
        }
    };

    const Component = singleLine ? Input : Textarea;

    return (
        <div className={cn("relative", className)}>
            <Component
                ref={inputRef as any}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDownInternal}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                className={cn(
                    "w-full bg-transparent", 
                    singleLine ? "" : "resize-none min-h-[60px]",
                    // Remove default focus ring if handled by parent
                    "focus-visible:ring-0 focus-visible:ring-offset-0 border-0 shadow-none px-0" 
                )}
            />
            
            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-50 w-64 mt-1 bg-popover border rounded-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100 p-1">
                    <ul className="max-h-[200px] overflow-y-auto py-1">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={suggestion.id}
                                className={cn(
                                    "px-3 py-1.5 text-sm cursor-pointer rounded-sm flex items-center gap-2",
                                    index === activeIndex ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                                )}
                                onMouseDown={(e) => {
                                    e.preventDefault(); // Prevent focus loss
                                    handleSelect(suggestion);
                                }}
                            >
                                <span className="truncate">{suggestion.label}</span>
                                {suggestion.type !== 'user' && (
                                    <span className="ml-auto opacity-50 text-[10px] uppercase font-semibold">{suggestion.type}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
});

MentionInput.displayName = 'MentionInput';
