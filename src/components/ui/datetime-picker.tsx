'use client';

import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DateTimePicker({ value, onChange, placeholder = 'Pick a date and time', className, disabled }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);
  const [timeValue, setTimeValue] = React.useState<string>(value ? format(value, 'HH:mm') : '08:00');

  // Update internal state when value prop changes
  React.useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setTimeValue(format(value, 'HH:mm'));
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined);
      onChange?.(undefined);
      return;
    }

    // Combine selected date with current time
    const [hours, minutes] = timeValue.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);

    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    setTimeValue(time);

    if (!selectedDate) return;

    // Update the time on the selected date
    const [hours, minutes] = time.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes, 0, 0);

      setSelectedDate(newDate);
      onChange?.(newDate);
    }
  };

  const formatDisplayTime = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          className={cn(
            '!h-[60px] w-full cursor-pointer rounded-[10px] border border-[#ECECEC] bg-white px-3 pb-4 pt-2 text-left text-xs font-medium text-ovu-primary shadow-none focus:border-ovu-primary focus:outline-none focus:ring-1 focus:ring-ovu-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            !selectedDate && 'text-gray-400',
            className
          )}
        >
          {selectedDate ? (
            <div className="flex flex-col">
              <span className="text-xs font-medium text-ovu-primary md:text-sm">
                {format(selectedDate, 'MMM dd, yyyy')} at {formatDisplayTime(timeValue)}
              </span>
              <span className="text-[10px] text-gray-400">Date & Time</span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-400 md:text-sm">{placeholder}</span>
              <span className="text-[10px] text-gray-400">Date & Time</span>
            </div>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={4}>
        <div className="flex flex-col">
          <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus />
          <div className="border-t p-3">
            <div className="flex items-center gap-2">
              <label htmlFor="time-input" className="text-sm font-medium text-gray-700">
                Time:
              </label>
              <Input
                id="time-input"
                type="time"
                value={timeValue}
                onChange={handleTimeChange}
                className="h-9 w-[140px]"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
