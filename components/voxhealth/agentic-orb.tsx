'use client';

import { useState } from 'react';

import { useHealthAgent } from '@/hooks/use-health-agent';
import { useVoiceRecorder } from '@/hooks/use-voice-recorder';
import type { AgentEvent } from '@/lib/agent/types';
import { buildEntryEnvelope, uploadEntry } from '@/lib/storage';

/**
 * AgenticOrb — the patient-facing voice button, but every interaction goes
 * through the HealthAgent.
 *
 * Press → record → release → the agent pipeline takes over:
 *   elevenlabs.transcribe → noah.analyze → ledger.seal →
 *   solana.sealEntry → (severity ≥ 4) virtuals.notifyCaregiver
 *
 * A small live strip below the orb shows what the agent is doing right now,
 * so the patient sees "Sealing on Ledger" / "Settling on Solana" instead of
 * an opaque spinner.
 */

const STAGE_LABELS: Record<string, string> = {
  'elevenlabs.transcribe': 'Listening · ElevenLabs transcribing',
  'noah.analyze': 'Reading · NoahAI analyzing',
  'noah.followUp': 'Asking · NoahAI follow-up',
  'ledger.seal': 'Sealing · Ledger device',
  'solana.sealEntry': 'Settling · Solana on-chain',
  'virtuals.notifyCaregiver': 'Paging · Virtuals caregiver',
  'mobile.queueOfflineEntry': 'Saving · offline queue',
};

export function AgenticOrb({ patientPubkey }: { patientPubkey?: string }) {
  const { agent, events, toolStatus } = useHealthAgent({ patientPubkey });
  const recorder = useVoiceRecorder();
  const [running, setRunning] = useState(false);

  const start = async () => {
    if (running) return;
    await recorder.startRecording();
  };

  const stop = async () => {
    setRunning(true);
    try {
      const blob = await recorder.stopRecording();
      const audioBase64 = blob ? await blobToBase64(blob) : '';

      // Stage 1 — transcribe.
      const transcribe = await agent.call<{ transcript: string }>(
        'elevenlabs.transcribe',
        { audioBase64, mimeType: blob?.type ?? 'audio/webm' },
      );
      agent.session.events.push({
        type: 'speech.in',
        transcript: transcribe.transcript,
        durationMs: recorder.duration * 1000,
        ts: Date.now(),
      });

      // Stage 2 — analyze.
      await agent.call('noah.analyze', { transcript: transcribe.transcript });

      // Stage 3 — upload encrypted envelope to storage (Arweave-shaped CID).
      const recordedAt = Math.floor(Date.now() / 1000);
      const severity = lastSeverity(events) ?? 2;
      const envelopeJson = buildEntryEnvelope({
        patientPubkey: patientPubkey ?? 'unattributed',
        transcript: transcribe.transcript,
        audioBase64,
        severity,
        recordedAt,
      });
      const upload = await uploadEntry({ data: envelopeJson });

      // Stage 4 — seal the (cid || patient || recordedAt) digest on Ledger.
      const seal = await agent.call<{ sigBase58: string }>('ledger.seal', {
        envelope: `${upload.cid}|${patientPubkey ?? 'unattributed'}|${recordedAt}`,
      });

      // Stage 5 — settle on Solana with the real CID + signature.
      await agent.call('solana.sealEntry', {
        cid: upload.cid,
        sigBase58: seal.sigBase58,
        severity,
        recordedAt,
      });

      // Stage 5 — escalate to caregiver if NoahAI flagged severity ≥ 4.
      const flag = lastFlag(events);
      if (flag && flag.severity >= 4) {
        const notifyInput: Record<string, string | number> = {
          reason: flag.reason,
          severity: flag.severity,
        };
        if (patientPubkey) notifyInput.patientPubkey = patientPubkey;
        await agent.call('virtuals.notifyCaregiver', notifyInput);
      }
    } finally {
      setRunning(false);
    }
  };

  const stage = currentStage(events);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Orb */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 -m-12 rounded-full orb-glow blur-2xl breathe" aria-hidden />
        <button
          onClick={recorder.isRecording ? stop : start}
          aria-pressed={recorder.isRecording}
          aria-label={recorder.isRecording ? 'Stop recording' : 'Tap to speak'}
          className="relative z-10 w-44 h-44 md:w-56 md:h-56 rounded-full bg-sage hover:opacity-95 transition-opacity flex items-center justify-center shadow-[0_24px_80px_rgba(46,126,111,0.32)]"
          disabled={running}
        >
          <div className="text-center text-white">
            {recorder.isRecording ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-[0.2em]">Recording</span>
              </div>
            ) : running ? (
              <span className="text-xs font-mono uppercase tracking-[0.2em]">Working</span>
            ) : (
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z M17.3 11.61c-.63-.59-1.55-.89-2.3-.89-.75 0-1.67.3-2.3.89.35.35.58.82.58 1.34 0 1.07-.93 1.94-2.08 1.94s-2.08-.87-2.08-1.94c0-.52.23-.99.58-1.34-.63-.59-1.55-.89-2.3-.89-.75 0-1.67.3-2.3.89C4.97 12.5 4.25 13.9 4.25 15.5 4.25 18.21 6.59 20.25 9.5 20.25s5.25-2.04 5.25-4.75c0-1.6-.72-3-1.7-4.14z" />
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Live stage strip */}
      <div className="min-h-[44px] text-center">
        {stage ? (
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-ink/40 bg-paper/80 backdrop-blur">
            <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              {STAGE_LABELS[stage] ?? stage}
            </span>
          </div>
        ) : (
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-subtle">
            Tap to speak
          </span>
        )}
      </div>

      {/* Tool telemetry */}
      <details className="w-full max-w-md text-xs font-mono">
        <summary className="cursor-pointer text-ink-subtle uppercase tracking-[0.18em]">
          Tools live · {toolStatus.filter((t) => t.status === 'live').length} / {toolStatus.length}
        </summary>
        <ul className="mt-3 grid grid-cols-2 gap-1.5">
          {toolStatus.map((t) => (
            <li key={t.name} className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  t.status === 'live' ? 'bg-sage' : 'bg-ink-subtle/50'
                }`}
              />
              <span className="text-[10px] text-ink-subtle">{t.name}</span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────

function currentStage(events: AgentEvent[]): string | null {
  for (let i = events.length - 1; i >= 0; i--) {
    const e = events[i];
    if (e.type === 'tool.call') return e.tool;
    if (e.type === 'tool.result' || e.type === 'tool.error') return null;
  }
  return null;
}

function lastFlag(events: AgentEvent[]): Extract<AgentEvent, { type: 'flag' }> | undefined {
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i].type === 'flag') return events[i] as Extract<AgentEvent, { type: 'flag' }>;
  }
  return undefined;
}

function lastSeverity(events: AgentEvent[]): 1 | 2 | 3 | 4 | 5 | undefined {
  return lastFlag(events)?.severity;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onloadend = () => {
      const result = reader.result as string;
      // Strip the `data:audio/webm;base64,` prefix.
      const idx = result.indexOf(',');
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.readAsDataURL(blob);
  });
}
