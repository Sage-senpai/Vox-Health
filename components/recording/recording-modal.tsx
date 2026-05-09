'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, CheckCircle2, Loader2, AlertCircle, Pencil } from 'lucide-react';

import { useVoiceRecorder } from '@/hooks/use-voice-recorder';
import { useHealthAgent } from '@/hooks/use-health-agent';
import { useWallet } from '@/context/wallet-context';
import { buildEntryEnvelope, uploadEntry } from '@/lib/storage';
import type { AgentEvent } from '@/lib/agent/types';

import { VoiceRecordButton } from './voice-record-button';
import { RecordingTimer } from './recording-timer';
import { WaveformAnimation } from './waveform-animation';

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
  transcript?: string;
  cid?: string;
  txSignature?: string;
}

type Step = 'recording' | 'review' | 'sealing' | 'done';

const STAGE_LABELS: Record<string, string> = {
  'noah.analyze': 'Analyzing Â· NoahAI',
  'ledger.seal': 'Sealing Â· Ledger',
  'solana.sealEntry': 'Settling Â· Solana',
  'virtuals.notifyCaregiver': 'Paging Â· Virtuals caregiver',
};

export function RecordingModal({ isOpen, onClose, onSave }: RecordingModalProps) {
  const recorder = useVoiceRecorder();
  const { publicKey } = useWallet();
  const { agent, events } = useHealthAgent({ patientPubkey: publicKey ?? undefined });

  const [step, setStep] = useState<Step>('recording');
  const [title, setTitle] = useState('');
  const [transcript, setTranscript] = useState('');
  const [severity, setSeverity] = useState(3);
  const [transcribing, setTranscribing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ cid: string; txSignature: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Reset all state whenever the modal closes.
  useEffect(() => {
    if (!isOpen) {
      recorder.reset();
      setStep('recording');
      setTitle('');
      setTranscript('');
      setSeverity(3);
      setTranscribing(false);
      setError(null);
      setResult(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // After stop, pull the blob, build a playback URL, and ask ElevenLabs to
  // transcribe so the user can review + edit before sealing.
  const handleStopAndReview = async () => {
    setError(null);
    const blob = await recorder.stopRecording();
    if (!blob) {
      setError('No audio captured. Try again.');
      return;
    }
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    setStep('review');
    setTranscribing(true);
    try {
      const audioBase64 = await blobToBase64(blob);
      const out = await agent.call<{ transcript: string; source: string }>(
        'elevenlabs.transcribe',
        { audioBase64, mimeType: blob.type ?? 'audio/webm' },
      );
      setTranscript(out.transcript);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setTranscribing(false);
    }
  };

  const handleSeal = async () => {
    if (!recorder.audioBlob || !transcript.trim()) {
      setError('Need audio and a transcript before sealing.');
      return;
    }
    setStep('sealing');
    setError(null);

    try {
      const audioBase64 = await blobToBase64(recorder.audioBlob);
      const recordedAt = Math.floor(Date.now() / 1000);

      // Note: we skip the live elevenlabs.transcribe step here â€” the user
      // already reviewed (and possibly edited) the transcript during the
      // review step. We feed the edited transcript directly into NoahAI.
      agent.session.events.push({
        type: 'speech.in',
        transcript,
        durationMs: recorder.duration * 1000,
        ts: Date.now(),
      });

      const analyze = await agent.call<{ severity: number; symptoms: string[] }>(
        'noah.analyze',
        { transcript },
      );
      // Honor the user's slider override unless NoahAI was clearly more severe.
      const finalSeverity = (Math.max(severity, analyze.severity) as 1 | 2 | 3 | 4 | 5);

      const envelope = buildEntryEnvelope({
        patientPubkey: publicKey ?? 'unattributed',
        transcript,
        audioBase64,
        severity: finalSeverity,
        symptoms: analyze.symptoms,
        recordedAt,
      });
      const upload = await uploadEntry({ data: envelope });

      const seal = await agent.call<{ sigBase58: string }>('ledger.seal', {
        envelope: `${upload.cid}|${publicKey ?? 'unattributed'}|${recordedAt}`,
      });

      const settle = await agent.call<{ txSignature: string }>('solana.sealEntry', {
        cid: upload.cid,
        sigBase58: seal.sigBase58,
        severity: finalSeverity,
        recordedAt,
      });

      const flag = lastFlag(events);
      if (flag && flag.severity >= 4) {
        const notify: Record<string, string | number> = {
          reason: flag.reason,
          severity: flag.severity,
        };
        if (publicKey) notify.patientPubkey = publicKey;
        await agent.call('virtuals.notifyCaregiver', notify);
      }

      setResult({ cid: upload.cid, txSignature: settle.txSignature });
      setStep('done');
      onSave({
        title: title || symptomTitleFromTranscript(transcript),
        description: transcript,
        severity: finalSeverity,
        audioBlob: recorder.audioBlob,
        transcript,
        cid: upload.cid,
        txSignature: settle.txSignature,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStep('review');
    }
  };

  if (!isOpen) return null;

  const stage = currentStage(events);

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto border-0 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground">
              {step === 'recording' && 'Record symptom'}
              {step === 'review' && 'Review & edit'}
              {step === 'sealing' && 'Sealing entry'}
              {step === 'done' && 'Entry sealed'}
            </h2>
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground mt-1">
              {step === 'recording' && 'Tap to start Â· tap to stop'}
              {step === 'review' && 'Listen back Â· fix anything the AI got wrong'}
              {step === 'sealing' && (stage ? STAGE_LABELS[stage] ?? stage : 'Workingâ€¦')}
              {step === 'done' && 'On-chain Â· Solana devnet'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-background rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 'recording' && (
            <div className="space-y-8">
              <div className="text-center space-y-6">
                <WaveformAnimation isRecording={recorder.isRecording} duration={recorder.duration} />
                <RecordingTimer duration={recorder.duration} isRecording={recorder.isRecording} />
                <VoiceRecordButton
                  isRecording={recorder.isRecording}
                  isPaused={recorder.isPaused}
                  onStartRecording={recorder.startRecording}
                  onStopRecording={handleStopAndReview}
                  onPauseRecording={recorder.pauseRecording}
                  onResumeRecording={recorder.resumeRecording}
                />
              </div>

              <div className="bg-background p-4 rounded-lg text-sm text-ink-muted">
                <p className="font-semibold text-foreground mb-2">Tips for best results:</p>
                <ul className="space-y-1 text-xs">
                  <li>â€¢ Speak clearly at your normal pace.</li>
                  <li>â€¢ Mention severity, when it started, and any change since yesterday.</li>
                  <li>â€¢ You&apos;ll be able to play it back and fix the transcript before saving.</li>
                </ul>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-6">
              {/* Audio playback */}
              {audioUrl && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <span>Listen back</span>
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      {Math.floor(recorder.duration)}s
                    </span>
                  </label>
                  <audio ref={audioRef} controls src={audioUrl} className="w-full" />
                </div>
              )}

              {/* Transcript editor */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Pencil className="w-3.5 h-3.5" />
                  Transcript {transcribing ? 'Â· transcribingâ€¦' : 'Â· edit anything the AI got wrong'}
                </label>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  disabled={transcribing}
                  placeholder={transcribing ? 'Listeningâ€¦' : 'Your transcribed words will appear here.'}
                  className="w-full px-3 py-3 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                  rows={6}
                />
                {transcribing && (
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    ElevenLabs is transcribing your audio.
                  </p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title (optional)</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={transcript ? symptomTitleFromTranscript(transcript) : 'e.g., Shoulder pain'}
                  className="h-10"
                />
              </div>

              {/* Severity */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center justify-between">
                  <span>Severity</span>
                  <span className="font-mono text-sm">{severity} / 5</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  NoahAI may revise this upward if it detects emergency markers.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setStep('recording');
                    recorder.reset();
                    setTranscript('');
                    if (audioUrl) URL.revokeObjectURL(audioUrl);
                    setAudioUrl(null);
                  }}
                  variant="outline"
                  size="lg"
                  className="flex-1 h-12"
                >
                  Re-record
                </Button>
                <Button
                  onClick={handleSeal}
                  disabled={transcribing || !transcript.trim()}
                  size="lg"
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white"
                >
                  Seal & Save
                </Button>
              </div>
            </div>
          )}

          {step === 'sealing' && (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {stage ? STAGE_LABELS[stage] ?? stage : 'Workingâ€¦'}
              </p>
              <p className="text-sm text-ink-muted max-w-md">
                Encrypting on your hardware key, anchoring on Solana, and (if needed) paging
                your caregiver agent.
              </p>
            </div>
          )}

          {step === 'done' && result && (
            <div className="space-y-5">
              <div className="p-4 bg-accent/10 border border-accent rounded-lg flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-accent">Entry sealed.</p>
                  <p className="text-sm text-ink-muted">
                    Your audio + transcript are encrypted off-chain and the on-chain pointer
                    is anchored. Only you and the doctors you grant access to can decrypt it.
                  </p>
                </div>
              </div>

              <ul className="space-y-2 text-sm font-mono">
                <li className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Storage CID</span>
                  <span className="text-foreground">{result.cid.slice(0, 8)}â€¦{result.cid.slice(-6)}</span>
                </li>
                <li className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Solana tx</span>
                  <span className="text-foreground">{result.txSignature.slice(0, 8)}â€¦{result.txSignature.slice(-6)}</span>
                </li>
              </ul>

              <Button
                onClick={onClose}
                size="lg"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onloadend = () => {
      const result = reader.result as string;
      const idx = result.indexOf(',');
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.readAsDataURL(blob);
  });
}

function symptomTitleFromTranscript(t: string): string {
  const cleaned = t.trim().replace(/\s+/g, ' ');
  const firstSentence = cleaned.split(/[.!?]/)[0] ?? cleaned;
  return firstSentence.length > 60 ? firstSentence.slice(0, 60) + 'â€¦' : firstSentence;
}

function currentStage(events: AgentEvent[]): string | null {
  for (let i = events.length - 1; i >= 0; i--) {
    const e = events[i];
    if (e.type === 'tool.call') return e.tool;
    if (e.type === 'tool.result' || e.type === 'tool.error') return null;
  }
  return null;
}

function lastFlag(events: AgentEvent[]) {
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i].type === 'flag') return events[i] as Extract<AgentEvent, { type: 'flag' }>;
  }
  return undefined;
}
