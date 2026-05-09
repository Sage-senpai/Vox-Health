'use client';

import { useState, useEffect } from 'react';
import { useVoiceRecorder } from '@/hooks/use-voice-recorder';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VoiceRecordButton } from './voice-record-button';
import { RecordingTimer } from './recording-timer';
import { WaveformAnimation } from './waveform-animation';
import { AIFollowupQuestions } from './ai-followup-questions';
import { X, CheckCircle2 } from 'lucide-react';

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: RecordingData) => void;
}

export interface RecordingData {
  title: string;
  description: string;
  severity: number;
  audioBlob?: Blob;
}

export function RecordingModal({ isOpen, onClose, onSave }: RecordingModalProps) {
  const {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    reset,
  } = useVoiceRecorder();

  const [step, setStep] = useState<'recording' | 'details'>('recording');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState(5);

  useEffect(() => {
    if (!isOpen) {
      reset();
      setStep('recording');
    }
  }, [isOpen, reset]);

  const handleStopAndDetails = async () => {
    await stopRecording();
    setStep('details');
  };

  const handleSave = () => {
    onSave({
      title: title || 'Health Entry',
      description,
      severity,
      audioBlob: audioBlob || undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            {step === 'recording' ? 'Record Symptom' : 'Save Entry'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-background rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 'recording' ? (
            // Recording Step
            <div className="space-y-8">
              <div className="text-center space-y-6">
                {/* Waveform */}
                <WaveformAnimation isRecording={isRecording} duration={duration} />

                {/* Timer */}
                <RecordingTimer duration={duration} isRecording={isRecording} />

                {/* Record Button */}
                <VoiceRecordButton
                  isRecording={isRecording}
                  isPaused={isPaused}
                  onStartRecording={startRecording}
                  onStopRecording={handleStopAndDetails}
                  onPauseRecording={pauseRecording}
                  onResumeRecording={resumeRecording}
                />
              </div>

              {/* Tips */}
              <div className="bg-background p-4 rounded-lg text-sm text-secondary">
                <p className="font-semibold text-foreground mb-2">Tips for best results:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Speak clearly and at a normal pace</li>
                  <li>• Describe your symptoms and how they affect you</li>
                  <li>• Mention any changes since your last entry</li>
                </ul>
              </div>
            </div>
          ) : (
            // Details Step
            <div className="space-y-6">
              {/* Success Message */}
              {audioBlob && (
                <div className="p-4 bg-accent/10 border border-accent rounded-lg flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-accent">
                    Recording saved successfully! {Math.floor(duration)} seconds.
                  </p>
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  What&apos;s happening? (Optional)
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Back pain, fatigue, etc."
                  className="h-10"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Additional Details (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any additional information about your symptoms..."
                  className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={4}
                />
              </div>

              {/* Severity */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Severity: {severity}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Follow-up Questions */}
              <AIFollowupQuestions questions={[]} onAnswerClick={() => {}} />

              {/* Save Button */}
              <Button
                onClick={handleSave}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-white text-base h-12"
              >
                Save Entry
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
