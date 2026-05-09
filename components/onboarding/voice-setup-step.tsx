'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Volume2, AlertCircle } from 'lucide-react';

interface VoiceSetupStepProps {
  onNext: () => void;
}

export function VoiceSetupStep({ onNext }: VoiceSetupStepProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);

  const handleRequestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermission(true);
    } catch (error) {
      console.log('[VoxHealth] Microphone permission denied');
      setMicPermission(false);
    }
  };

  const handleTestRecording = async () => {
    if (!micPermission) {
      await handleRequestPermission();
      return;
    }

    if (!isRecording) {
      setIsRecording(true);
      // Simulate recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setHasRecorded(true);
      }, 3000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif font-bold text-foreground">
          Set Up Your Voice
        </h2>
        <p className="text-ink-muted">
          Let&apos;s test your microphone to make sure everything works smoothly.
        </p>
      </div>

      {/* Microphone Permission Status */}
      {micPermission === false && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-destructive">Microphone access denied</p>
            <p className="text-destructive/80">
              Please enable microphone permissions in your browser settings to continue.
            </p>
          </div>
        </div>
      )}

      {/* Test Recording Card */}
      <div className="p-8 bg-background rounded-lg border border-border text-center space-y-6">
        {/* Animated Mic Icon */}
        <div className="flex justify-center">
          <div
            className={`w-20 h-20 bg-primary rounded-full flex items-center justify-center transition-all ${
              isRecording ? 'animate-pulse' : ''
            }`}
          >
            <Mic className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Status Text */}
        <div>
          {isRecording && (
            <p className="text-lg font-semibold text-primary">
              Recording... Say something!
            </p>
          )}
          {hasRecorded && (
            <p className="text-lg font-semibold text-accent">
              Great! Your voice was recorded successfully.
            </p>
          )}
          {!isRecording && !hasRecorded && (
            <p className="text-base text-ink-muted">
              Click the button below to test your microphone
            </p>
          )}
        </div>

        {/* Test Button */}
        <Button
          onClick={handleTestRecording}
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-white text-base h-12"
        >
          {isRecording
            ? 'Recording...'
            : hasRecorded
              ? 'Test Again'
              : 'Test Microphone'}
        </Button>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-background rounded-lg border border-border space-y-3">
        <div className="flex gap-3">
          <Volume2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-foreground">Pro Tips</p>
            <ul className="text-ink-muted space-y-1 mt-2">
              <li>â€¢ Speak clearly and at a normal volume</li>
              <li>â€¢ Find a quiet space for best results</li>
              <li>â€¢ You can always re-record your entries</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Button
        onClick={onNext}
        disabled={!hasRecorded}
        size="lg"
        className="w-full text-base h-12"
      >
        Continue
      </Button>
    </div>
  );
}
