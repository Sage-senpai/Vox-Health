'use client';

interface WaveformAnimationProps {
  isRecording: boolean;
  duration: number;
}

export function WaveformAnimation({ isRecording, duration }: WaveformAnimationProps) {
  // Generate random heights for visual effect
  const bars = Array.from({ length: 20 }).map(() =>
    Math.random() * 100
  );

  return (
    <div className="flex items-end justify-center gap-1 h-24">
      {bars.map((height, i) => (
        <div
          key={i}
          className={`w-1 bg-primary rounded-full transition-all ${
            isRecording ? 'animate-pulse' : ''
          }`}
          style={{
            height: isRecording ? `${30 + Math.random() * 60}%` : '20%',
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
}
