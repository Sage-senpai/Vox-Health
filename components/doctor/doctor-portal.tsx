'use client';

import { useEffect, useState } from 'react';

import { useHealthAgent } from '@/hooks/use-health-agent';
import { useWallet } from '@/context/wallet-context';

interface VerifyResult {
  valid: boolean;
  expiresAt?: number;
  accessLevel?: 0 | 1 | 2;
  source: 'live' | 'mock';
  patient: string;
}

interface SpokenSummary {
  audioUrl: string;
  text: string;
  source: 'live' | 'mock';
}

const ACCESS_LABELS = ['View', 'Comment', 'Full'];

export function DoctorPortal() {
  const { publicKey: doctorPubkey, connect, isConnected } = useWallet();
  const { agent, toolStatus } = useHealthAgent();
  const [patientInput, setPatientInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SpokenSummary | null>(null);
  const [synthesizing, setSynthesizing] = useState(false);

  // Pre-fill from a scanned grant URL (?patient=...).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const patient = params.get('patient');
    if (patient) setPatientInput(patient);
  }, []);

  const verify = async () => {
    setError(null);
    setResult(null);
    setSummary(null);
    if (!patientInput.trim()) {
      setError('Enter a patient pubkey or paste a QR-decoded grant URL.');
      return;
    }
    if (!isConnected) await connect();
    if (!doctorPubkey) {
      setError('Connect a wallet so the grant can be verified against your pubkey.');
      return;
    }

    setVerifying(true);
    try {
      const out = await agent.call<Omit<VerifyResult, 'patient'>>('solana.verifyDoctorGrant', {
        patientPubkey: patientInput.trim(),
        doctorPubkey,
      });
      setResult({ ...out, patient: patientInput.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setVerifying(false);
    }
  };

  const playSummary = async () => {
    if (!result?.valid) return;
    setSynthesizing(true);
    try {
      // In production this text comes from noah.summarize over the patient's
      // last 30 days; for the demo we synthesize a fixed clinical brief.
      const text =
        `Patient ${result.patient.slice(0, 6)} has logged 23 voice entries this month. ` +
        `Median severity 3 of 5. Two NoahAI flags this week — both shoulder pain after ` +
        `gardening, trending down. Medications: Metformin, Lisinopril, Atorvastatin. ` +
        `Adherence 92 percent. No drug interaction concerns.`;
      const out = await agent.call<SpokenSummary>('elevenlabs.synthesize', { text });
      setSummary(out);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSynthesizing(false);
    }
  };

  const liveCount = toolStatus.filter((t) => t.status === 'live').length;

  return (
    <div className="ink-panel p-6 md:p-8 space-y-6">
      <header className="flex items-baseline justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
          Verify access · agent live · {liveCount} / {toolStatus.length} tools
        </p>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-subtle">
          {doctorPubkey
            ? `you · ${doctorPubkey.slice(0, 6)}…${doctorPubkey.slice(-4)}`
            : 'wallet · disconnected'}
        </span>
      </header>

      {/* Input */}
      <div className="space-y-3">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle mb-2 block">
            Patient pubkey or grant payload
          </span>
          <input
            type="text"
            value={patientInput}
            onChange={(e) => setPatientInput(e.target.value)}
            placeholder="patient-base58-pubkey"
            className="w-full border border-ink bg-paper/90 px-3 py-2 text-sm font-mono"
          />
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={verify}
            disabled={verifying}
            className="btn-accent"
          >
            {verifying ? 'Verifying…' : '◉ Verify grant'}
          </button>
          <button
            type="button"
            onClick={() => connect()}
            className="btn-secondary"
            disabled={isConnected}
          >
            {isConnected ? '✓ Connected' : 'Connect wallet'}
          </button>
        </div>
      </div>

      {error && (
        <div className="border border-coral/60 bg-coral-soft/40 p-4 text-sm text-ink">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral mr-2">
            error
          </span>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className={`p-5 border ${
            result.valid ? 'border-sage bg-sage-soft/40' : 'border-coral bg-coral-soft/40'
          }`}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle mb-3">
            {result.source} · {result.valid ? 'grant valid' : 'grant invalid'}
          </p>
          <ul className="space-y-2 text-sm">
            <Row label="Patient" value={`${result.patient.slice(0, 8)}…${result.patient.slice(-6)}`} />
            <Row
              label="Status"
              value={result.valid ? 'Active' : 'Expired or never granted'}
            />
            {result.valid && result.expiresAt && (
              <Row
                label="Expires"
                value={new Date(result.expiresAt * 1000).toLocaleString()}
              />
            )}
            {result.valid && result.accessLevel !== undefined && (
              <Row label="Access level" value={ACCESS_LABELS[result.accessLevel]} />
            )}
          </ul>

          {result.valid && (
            <div className="mt-5 pt-5 border-t border-ink/10 space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
                Spoken summary · ElevenLabs
              </p>
              <button
                type="button"
                onClick={playSummary}
                disabled={synthesizing}
                className="btn-primary"
              >
                {synthesizing ? 'Synthesizing…' : '▶ Hear 30-day summary'}
              </button>
              {summary && (
                <div className="space-y-2">
                  {summary.source === 'live' && summary.audioUrl && (
                    <audio controls src={summary.audioUrl} className="w-full" />
                  )}
                  <p className="text-sm text-ink-muted leading-relaxed italic">
                    “{summary.text}”
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-subtle">
                    source · {summary.source}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline justify-between">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-subtle">
        {label}
      </span>
      <span className="text-sm font-semibold text-ink">{value}</span>
    </li>
  );
}
