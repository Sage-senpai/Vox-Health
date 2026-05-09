'use client';

import { Heart, Pill, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function QuickStatsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Entries This Week */}
      <Card className="p-6 bg-background border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Entries This Week</p>
            <p className="text-3xl font-serif font-bold text-foreground">12</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>

      {/* Medications On Schedule */}
      <Card className="p-6 bg-background border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Medications On Schedule</p>
            <p className="text-3xl font-serif font-bold text-accent">100%</p>
          </div>
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <Pill className="w-6 h-6 text-accent" />
          </div>
        </div>
      </Card>

      {/* Days Since First Entry */}
      <Card className="p-6 bg-background border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Days Tracking</p>
            <p className="text-3xl font-serif font-bold text-primary">47</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>
    </div>
  );
}
