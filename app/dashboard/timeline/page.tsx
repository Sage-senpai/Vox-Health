'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/timeline/date-range-picker';
import { TimelineGraph } from '@/components/timeline/timeline-graph';
import { TimelineCard } from '@/components/timeline/timeline-card';
import { Download, Filter } from 'lucide-react';

export default function TimelinePage() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('7d');

  const entries = [
    {
      id: '1',
      title: 'Morning Back Pain',
      description: 'Sharp pain in lower back, especially after sitting. Duration about 2 hours.',
      timestamp: '2 days ago at 9:30 AM',
      severity: 6,
      type: 'symptom' as const,
      hasAudio: true,
    },
    {
      id: '2',
      title: 'Took Medications',
      description: 'Completed morning medication routine. No issues.',
      timestamp: '2 days ago at 8:00 AM',
      severity: 1,
      type: 'medication' as const,
      hasAudio: false,
    },
    {
      id: '3',
      title: 'Evening Fatigue',
      description: 'Unusual tiredness. Could be related to increased activity yesterday.',
      timestamp: '1 day ago at 6:15 PM',
      severity: 4,
      type: 'symptom' as const,
      hasAudio: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-1">
            Your Health Timeline
          </h1>
          <p className="text-ink-muted">
            View all your entries, medications, and health records in one place
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Severity Graph */}
      <TimelineGraph timeframe={timeframe} />

      {/* Date Range Selector */}
      <DateRangePicker selected={timeframe} onSelect={setTimeframe} />

      {/* Timeline Entries */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <TimelineCard key={entry.id} {...entry} />
        ))}
      </div>
    </div>
  );
}
