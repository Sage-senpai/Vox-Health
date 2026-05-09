'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';

export function VoiceDemoSection() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleRecord = async () => {
    if (!isRecording) {
      setIsRecording(true);
      setTranscript('');
      // ElevenLabs voice recording would be integrated here
      // Using browser MediaRecorder API for now
    } else {
      setIsRecording(false);
    }
  };

  return (
    <section className="relative w-full bg-background py-32 border-t border-white/10">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Info */}
          <div>
            <h2 className="text-5xl font-serif font-black text-white mb-6 tracking-tight">
              Experience Voice First
            </h2>
            <div className="w-16 h-1 bg-primary mb-8" />
            <p className="text-white/70 text-lg font-light leading-relaxed mb-8">
              No typing. No forms. No friction. Just speak naturally about your health and let AI handle the rest.
            </p>
            <ul className="space-y-4 text-white/60 font-light">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Real-time transcription with medical context</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Symptom extraction and severity assessment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Automatic sharing with your healthcare team</span>
              </li>
            </ul>
          </div>

          {/* Right: Demo */}
          <div className="relative">
            {/* Recording card */}
            <div className="border border-white/10 bg-white/5 p-12 rounded-none">
              {/* Animated recording indicator */}
              {isRecording && (
                <div className="absolute inset-0 border border-primary/50 rounded-none animate-pulse" />
              )}

              <div className="relative z-10 text-center">
                {/* Mic icon with animation */}
                <div className="flex justify-center mb-8">
                  <button
                    onClick={handleRecord}
                    className={`w-20 h-20 rounded-none flex items-center justify-center transition-all ${
                      isRecording
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'border border-primary text-primary hover:bg-primary/10'
                    }`}
                  >
                    {isRecording ? (
                      <Square className="w-8 h-8 fill-current" />
                    ) : (
                      <Mic className="w-8 h-8" />
                    )}
                  </button>
                </div>

                {/* Status */}
                <div className="text-white/60 font-light text-sm mb-4">
                  {isRecording ? 'Recording...' : 'Click to record'}
                </div>

                {/* Waveform visualization */}
                <div className="flex items-end justify-center gap-1 h-16 mb-8">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary/60 rounded-t-sm transition-all"
                      style={{
                        height: isRecording ? `${Math.random() * 100}%` : '20%',
                        animation: isRecording ? `pulse ${0.3 + i * 0.02}s infinite` : 'none',
                      }}
                    />
                  ))}
                </div>

                {/* Transcript preview */}
                {transcript && (
                  <div className="text-white/80 text-sm leading-relaxed text-left bg-white/5 p-4 border border-white/10">
                    {transcript}
                  </div>
                )}
              </div>
            </div>

            {/* Info badge */}
            <div className="mt-8 text-center text-white/50 text-xs font-light">
              Powered by ElevenLabs Conversational AI
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
