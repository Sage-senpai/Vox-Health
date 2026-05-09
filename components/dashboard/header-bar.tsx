'use client';

import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderBarProps {
  onRecordClick: () => void;
}

export function HeaderBar({ onRecordClick }: HeaderBarProps) {
  const today = new Date();
  const greeting = getGreeting();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="bg-white border-b border-border sticky top-0 z-10">
      <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            {greeting}
          </h1>
          <p className="text-sm text-secondary">
            {dayOfWeek}, {monthDay}
          </p>
        </div>

        <Button
          onClick={onRecordClick}
          size="lg"
          className="md:h-14 md:px-6 bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2 w-full md:w-auto"
        >
          <Mic className="w-5 h-5" />
          <span>Record Symptom</span>
        </Button>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}
