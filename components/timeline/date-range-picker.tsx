'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  selected: '7d' | '30d' | 'all';
  onSelect: (range: '7d' | '30d' | 'all') => void;
}

export function DateRangePicker({ selected, onSelect }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-ink-muted" />
      <div className="flex gap-2 bg-background rounded-lg p-1">
        {(
          [
            { value: '7d' as const, label: 'Last 7 Days' },
            { value: '30d' as const, label: 'Last 30 Days' },
            { value: 'all' as const, label: 'All Time' },
          ] as const
        ).map((option) => (
          <Button
            key={option.value}
            onClick={() => onSelect(option.value)}
            variant={selected === option.value ? 'default' : 'ghost'}
            size="sm"
            className={selected === option.value ? 'bg-primary text-white' : ''}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
