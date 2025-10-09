
'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface DateRangePickerProps extends React.ComponentProps<'div'> {
  onUpdate: (values: { range: DateRange }) => void;
  initialDateFrom?: Date;
  initialDateTo?: Date;
  align?: 'start' | 'center' | 'end';
  locale?: string;
  showCompare?: boolean;
}

export const DateRangePicker = ({
  className,
  onUpdate,
  initialDateFrom,
  initialDateTo,
  align = 'start',
  locale = 'en-US',
  showCompare = false,
}: DateRangePickerProps) => {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: initialDateFrom,
    to: initialDateTo,
  });

  const handleUpdate = (range: DateRange | undefined) => {
    setRange(range);
    if (range?.from && onUpdate) {
      onUpdate({ range });
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !range && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {range?.from ? (
              range.to ? (
                <>
                  {format(range.from, 'LLL dd, y')} -{' '}
                  {format(range.to, 'LLL dd, y')}
                </>
              ) : (
                format(range.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={handleUpdate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
