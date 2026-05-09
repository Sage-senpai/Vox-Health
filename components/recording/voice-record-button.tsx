'use client';

import { Mic, Square, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceRecordButtonProps {
  isRecording: boolean;
  isPaused: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  disabled?: boolean;
}

export function VoiceRecordButton({
  isRecording,
  isPaused,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  disabled = false,
}: VoiceRecordButtonProps) {
  if (!isRecording) {
    return (
      <Button
        onClick={onStartRecording}
        disabled={disabled}
        size="lg"
        className="w-40 h-40 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all"
      >
        <div className="flex flex-col items-center gap-3">
          <Mic className="w-12 h-12" />
          <span className="text-sm font-semibold">Start Recording</span>
        </div>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4 justify-center">
      {/* Stop Button */}
      <Button
        onClick={onStopRecording}
        size="lg"
        className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90 text-white shadow-lg"
      >
        <Square className="w-6 h-6" />
      </Button>

      {/* Pause/Resume Button */}
      <Button
        onClick={isPaused ? onResumeRecording : onPauseRecording}
        variant="outline"
        size="lg"
        className="w-16 h-16 rounded-full"
      >
        {isPaused ? (
          <Play className="w-6 h-6" />
        ) : (
          <Pause className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
}
