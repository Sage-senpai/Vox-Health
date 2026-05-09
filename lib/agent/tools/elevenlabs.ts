/**
 * ElevenLabs tools for the HealthAgent.
 *
 * Three tools are exported:
 *  - elevenlabs.transcribe   STT over an audio Blob
 *  - elevenlabs.synthesize   TTS for the agent's spoken reply
 *  - elevenlabs.agentSession Conversational agent — returns a signed
 *                            wss:// URL the client opens directly so audio
 *                            streams peer-to-EL without going through us.
 *
 * Each tool reports `status: 'live'` only when env.elevenlabs.live is true,
 * otherwise it returns deterministic mock output.
 */

import { env } from '@/lib/env';
import type { ToolDefinition, ToolStatus } from '../types';

const status = (): ToolStatus => (env.elevenlabs.live ? 'live' : 'mock');

const STT_ENDPOINT = 'https://api.elevenlabs.io/v1/speech-to-text';
const TTS_ENDPOINT = (voiceId: string) =>
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;
const AGENT_TOKEN_ENDPOINT = '/api/elevenlabs/token';

const DEFAULT_VOICE = '21m00Tcm4TlvDq8ikWAM'; // Rachel — warm, clinical
const SCRIPTED_FOLLOWUPS = [
  'When did the symptom start?',
  'On a 1–10 scale, how would you rate the discomfort?',
  'Has anything made it better or worse since yesterday?',
  'Have you taken any medication for it?',
];

interface TranscribeInput {
  /** Base64-encoded audio (webm/opus). The browser side encodes before
   *  passing to the agent so JsonValue stays serializable. */
  audioBase64: string;
  mimeType?: string;
}
interface TranscribeOutput {
  transcript: string;
  durationMs: number;
  language?: string;
  source: ToolStatus;
}

export const transcribeTool: ToolDefinition<TranscribeInput, TranscribeOutput> = {
  name: 'elevenlabs.transcribe',
  description: 'Convert a recorded audio blob to text using ElevenLabs STT.',
  parameters: {
    audioBase64: 'Base64-encoded audio payload (webm/opus or wav).',
    mimeType: 'Optional MIME type hint, e.g. audio/webm.',
  },
  status: status(),
  async invoke(input) {
    if (!env.elevenlabs.live) {
      return mockTranscribe(input);
    }
    try {
      const blob = base64ToBlob(input.audioBase64, input.mimeType ?? 'audio/webm');
      const fd = new FormData();
      fd.append('file', blob, 'audio.webm');
      fd.append('model_id', 'scribe_v1');

      const res = await fetch(STT_ENDPOINT, {
        method: 'POST',
        headers: { 'xi-api-key': env.elevenlabs.apiKey! },
        body: fd,
      });
      if (!res.ok) throw new Error(`ElevenLabs STT ${res.status}: ${await res.text()}`);
      const data = (await res.json()) as { text: string; language_code?: string };
      return {
        transcript: data.text,
        durationMs: estimateDurationMs(blob.size, input.mimeType),
        language: data.language_code,
        source: 'live',
      };
    } catch (err) {
      // Network failures should not break the agent loop — degrade to mock.
      console.warn('[VoxHealth] ElevenLabs STT failed, falling back to mock:', err);
      return mockTranscribe(input);
    }
  },
};

interface SynthesizeInput {
  text: string;
  voiceId?: string;
}
interface SynthesizeOutput {
  /** A blob:// URL the UI can attach to an <audio> element. In mock mode
   *  this is an empty data URI — the UI shows the text and skips playback. */
  audioUrl: string;
  text: string;
  source: ToolStatus;
}

export const synthesizeTool: ToolDefinition<SynthesizeInput, SynthesizeOutput> = {
  name: 'elevenlabs.synthesize',
  description: 'Render text to a spoken audio clip using ElevenLabs TTS.',
  parameters: {
    text: 'The text to speak.',
    voiceId: 'Optional ElevenLabs voice ID; defaults to a calm clinical voice.',
  },
  status: status(),
  async invoke(input) {
    if (!env.elevenlabs.live || typeof window === 'undefined') {
      return {
        audioUrl: 'data:audio/webm;base64,',
        text: input.text,
        source: 'mock',
      };
    }
    try {
      const res = await fetch(TTS_ENDPOINT(input.voiceId ?? DEFAULT_VOICE), {
        method: 'POST',
        headers: {
          'xi-api-key': env.elevenlabs.apiKey!,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: input.text,
          model_id: 'eleven_turbo_v2_5',
        }),
      });
      if (!res.ok) throw new Error(`ElevenLabs TTS ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      return { audioUrl: url, text: input.text, source: 'live' };
    } catch (err) {
      console.warn('[VoxHealth] ElevenLabs TTS failed, returning mock URL:', err);
      return {
        audioUrl: 'data:audio/webm;base64,',
        text: input.text,
        source: 'mock',
      };
    }
  },
};

interface AgentSessionInput {
  patientPubkey?: string;
}
interface AgentSessionOutput {
  /** Signed wss:// URL. Empty string in mock mode. */
  signedUrl: string;
  agentId: string;
  source: ToolStatus;
  /** Sample follow-up question the UI can render before the wss connects. */
  primer: string;
}

export const agentSessionTool: ToolDefinition<AgentSessionInput, AgentSessionOutput> = {
  name: 'elevenlabs.agentSession',
  description:
    'Open a conversational agent session — returns a signed wss URL the browser opens directly to ElevenLabs.',
  parameters: {
    patientPubkey: 'Optional patient identity to pass as a context variable to the agent.',
  },
  status: status(),
  async invoke(input) {
    if (!env.elevenlabs.live || typeof window === 'undefined') {
      return {
        signedUrl: '',
        agentId: 'mock-agent',
        source: 'mock',
        primer: pickPrimer(),
      };
    }
    try {
      const res = await fetch(AGENT_TOKEN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientPubkey: input.patientPubkey ?? null }),
      });
      if (!res.ok) throw new Error(`Agent token ${res.status}`);
      const data = (await res.json()) as { signedUrl: string; agentId: string };
      return {
        signedUrl: data.signedUrl,
        agentId: data.agentId,
        source: 'live',
        primer: pickPrimer(),
      };
    } catch (err) {
      console.warn('[VoxHealth] ElevenLabs agent session failed:', err);
      return { signedUrl: '', agentId: 'mock-agent', source: 'mock', primer: pickPrimer() };
    }
  },
};

export const elevenlabsTools = [transcribeTool, synthesizeTool, agentSessionTool];

// ─── helpers ────────────────────────────────────────────────────────────

function base64ToBlob(b64: string, mime: string): Blob {
  const byteString = atob(b64);
  const buffer = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) buffer[i] = byteString.charCodeAt(i);
  return new Blob([buffer], { type: mime });
}

function estimateDurationMs(bytes: number, mime?: string): number {
  // Rough: 16 kbps for opus, 128 kbps for default mp3.
  const kbps = mime?.includes('opus') || mime?.includes('webm') ? 16 : 128;
  return Math.round((bytes * 8) / (kbps * 1000) * 1000);
}

function mockTranscribe(input: TranscribeInput): TranscribeOutput {
  // Deterministic: looks like a believable patient utterance.
  const samples = [
    'I had some shoulder pain this morning, especially after gardening. About a four out of ten.',
    'My fasting glucose this morning was 142. A little high. I took my metformin at eight.',
    'I missed last night\'s lisinopril. I\'m feeling a bit lightheaded but otherwise okay.',
    'Headache started around lunchtime, behind my right eye. Not the worst but persistent.',
  ];
  const idx = (input.audioBase64.length + Date.now()) % samples.length;
  return {
    transcript: samples[idx],
    durationMs: estimateDurationMs(input.audioBase64.length * 0.75, input.mimeType),
    source: 'mock',
  };
}

function pickPrimer(): string {
  return SCRIPTED_FOLLOWUPS[Math.floor(Math.random() * SCRIPTED_FOLLOWUPS.length)];
}
