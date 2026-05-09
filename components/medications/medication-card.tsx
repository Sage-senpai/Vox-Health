'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Clock, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

interface MedicationCardProps {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  adherence: number;
  nextDue?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onMarkTaken?: () => void;
}

export function MedicationCard({
  id,
  name,
  dosage,
  frequency,
  adherence,
  nextDue,
  onEdit,
  onDelete,
  onMarkTaken,
}: MedicationCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Pill className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{name}</h3>
            <p className="text-sm text-ink-muted">{dosage}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-serif font-bold text-accent">{adherence}%</p>
          <p className="text-xs text-muted-foreground">Adherence</p>
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-muted flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {frequency}
          </span>
          {nextDue && (
            <span className="text-foreground font-medium">Due {nextDue}</span>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          {onMarkTaken && (
            <Button
              onClick={onMarkTaken}
              size="sm"
              className="bg-accent hover:bg-accent/90 text-white gap-2 flex-1"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Taken</span>
            </Button>
          )}
          {onEdit && (
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              onClick={onDelete}
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive gap-2"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
