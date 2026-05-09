'use client';

interface RecordingTimerProps {
  duration: number;
  isRecording: boolean;
}

export function RecordingTimer({ duration, isRecording }: RecordingTimerProps) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className={`text-center ${isRecording ? 'animate-pulse' : ''}`}>
      <div className="text-6xl font-serif font-bold text-primary font-mono">
        {formattedTime}
      </div>
      {isRecording && (
        <p className="text-sm text-ink-muted mt-2">Recording in progress...</p>
      )}
    </div>
  );
}
