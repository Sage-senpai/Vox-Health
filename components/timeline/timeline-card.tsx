'use client';

import { useState } from 'react';
import { toast } from 'sonner';
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
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');

  const typeColors = {
    symptom: 'border-l-primary',
    medication: 'border-l-accent',
    note: 'border-l-secondary',
  };

  const onPlay = () => {
    toast.message(`Playing ${title}`, {
      description: 'Audio is encrypted off-chain (Arweave). Decryption requires your key.',
    });
  };

  const onSaveNote = () => {
    if (!note.trim()) {
      toast.error('Note is empty');
      return;
    }
    toast.success('Note added', { description: `"${note.slice(0, 60)}${note.length > 60 ? '…' : ''}"` });
    setNote('');
    setNoteOpen(false);
  };

  const onExport = () => {
    const payload = JSON.stringify({ id, title, description, timestamp, severity, type }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voxhealth-entry-${id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success('Entry exported');
  };

  return (
    <Card className={`p-6 border-l-4 ${typeColors[type]} hover:shadow-md transition-shadow`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <div className="flex items-center gap-2 text-sm text-ink-muted mt-1">
              <Clock className="w-4 h-4" />
              <span>{timestamp}</span>
            </div>
          </div>
          <SeverityBadge severity={severity} />
        </div>

        {/* Description */}
        <p className="text-ink-muted leading-relaxed">{description}</p>

        {/* Audio Playback */}
        {hasAudio && (
          <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
            <Volume2 className="w-4 h-4 text-primary" />
            <span className="text-xs text-ink-muted">Audio recording available</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border">
          {hasAudio && (
            <Button onClick={onPlay} variant="outline" size="sm" className="gap-2">
              <Volume2 className="w-4 h-4" />
              <span>Play Recording</span>
            </Button>
          )}
          <Button
            onClick={() => setNoteOpen((o) => !o)}
            variant={noteOpen ? 'default' : 'outline'}
            size="sm"
            className="gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Add Note</span>
          </Button>
          <Button onClick={onExport} variant="outline" size="sm" className="gap-2 ml-auto">
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Export</span>
          </Button>
        </div>

        {/* Note editor */}
        {noteOpen && (
          <div className="space-y-2 pt-2">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a private note to this entry…"
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex gap-2 justify-end">
              <Button onClick={() => setNoteOpen(false)} variant="ghost" size="sm">
                Cancel
              </Button>
              <Button onClick={onSaveNote} size="sm">
                Save note
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
