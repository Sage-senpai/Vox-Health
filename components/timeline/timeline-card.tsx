'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SeverityBadge } from './severity-badge';
import { Clock, Volume2, MessageCircle, Download } from 'lucide-react';

interface TimelineCardProps {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: number;
  type: 'symptom' | 'medication' | 'note';
  hasAudio?: boolean;
}

export function TimelineCard({
  id,
  title,
  description,
  timestamp,
  severity,
  type,
  hasAudio = false,
}: TimelineCardProps) {
  const typeColors = {
    symptom: 'border-l-primary',
    medication: 'border-l-accent',
    note: 'border-l-secondary',
  };

  return (
    <Card className={`p-6 border-l-4 ${typeColors[type]} hover:shadow-md transition-shadow`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <div className="flex items-center gap-2 text-sm text-secondary mt-1">
              <Clock className="w-4 h-4" />
              <span>{timestamp}</span>
            </div>
          </div>
          <SeverityBadge severity={severity} />
        </div>

        {/* Description */}
        <p className="text-secondary leading-relaxed">{description}</p>

        {/* Audio Playback */}
        {hasAudio && (
          <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
            <Volume2 className="w-4 h-4 text-primary" />
            <span className="text-xs text-secondary">Audio recording available</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border">
          {hasAudio && (
            <Button variant="outline" size="sm" className="gap-2">
              <Volume2 className="w-4 h-4" />
              <span>Play Recording</span>
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>Add Note</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 ml-auto">
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Export</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
