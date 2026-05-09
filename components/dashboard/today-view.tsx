'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, Check, Pill } from 'lucide-react';

const recentEntries = [
  {
    id: '1',
    time: '2:30 PM',
    title: 'Morning Pain in Lower Back',
    severity: 6,
    symptoms: ['Back Pain', 'Stiffness'],
  },
  {
    id: '2',
    time: '10:15 AM',
    title: 'Took Morning Medications',
    severity: 1,
    symptoms: ['Routine Check'],
  },
];

const upcomingMeds = [
  { id: 'lisinopril', name: 'Lisinopril', dosage: '10mg', time: '6:00 PM' },
  { id: 'metformin', name: 'Metformin', dosage: '500mg', time: '8:00 PM' },
];

export function TodayView() {
  const [taken, setTaken] = useState<Record<string, boolean>>({});

  const markTaken = (medId: string, medName: string) => {
    setTaken((prev) => {
      const next = { ...prev, [medId]: !prev[medId] };
      if (next[medId]) {
        toast.success(`${medName} marked as taken`);
      } else {
        toast.message(`${medName} unmarked`);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* How Are You Feeling */}
      <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            How are you feeling today?
          </h3>
          <p className="text-ink-muted leading-relaxed">
            Take a moment to describe any symptoms, concerns, or changes you&apos;ve noticed.
            You can always record more later.
          </p>
        </div>
      </Card>

      {/* Recent Entries */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Today&apos;s Entries</h3>
        {recentEntries.map((entry) => (
          <Card key={entry.id} className="p-4 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-ink-muted" />
                  <span className="text-sm text-ink-muted">{entry.time}</span>
                </div>
                <h4 className="font-semibold text-foreground">{entry.title}</h4>
                <div className="flex flex-wrap gap-2">
                  {entry.symptoms.map((symptom, i) => (
                    <span
                      key={i}
                      className="inline-block px-2 py-1 bg-background rounded text-xs text-ink-muted"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="inline-block px-3 py-1 bg-primary/10 rounded-full">
                  <span className="text-sm font-semibold text-primary">
                    {entry.severity}/10
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Upcoming Medications */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Upcoming Medications</h3>
        {upcomingMeds.map((med) => {
          const isTaken = !!taken[med.id];
          return (
            <Card key={med.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Pill className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className={`font-semibold ${isTaken ? 'text-ink-muted line-through' : 'text-foreground'}`}>
                    {med.name}
                  </h4>
                  <p className="text-sm text-ink-muted">{med.dosage}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{med.time}</p>
                <Button
                  variant={isTaken ? 'default' : 'outline'}
                  size="sm"
                  className="mt-2 gap-1"
                  onClick={() => markTaken(med.id, med.name)}
                >
                  {isTaken && <Check className="w-3 h-3" />}
                  {isTaken ? 'Taken' : 'Mark Taken'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State Info */}
      <Card className="p-6 bg-background border-border">
        <div className="flex gap-4">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-foreground mb-2">Stay Consistent</p>
            <p className="text-ink-muted">
              Regular entries help you and your doctor identify patterns and improvements in your health.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
