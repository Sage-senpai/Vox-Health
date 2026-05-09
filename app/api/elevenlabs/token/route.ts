/**
 * Mints a short-lived signed wss URL for the ElevenLabs conversational agent.
 *
 * Why a server route: ElevenLabs requires the xi-api-key to mint a signed URL
 * but that key must never reach the browser. The browser POSTs here, we sign,
 * we return a one-time wss:// URL that's safe to open client-side.
 *
 * Falls back to a 503 with a useful message when keys are missing — the UI's
 * agentSession tool has already degraded to mock by that point.
 */

import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export const runtime = 'nodejs';

interface SignRequest {
  patientPubkey?: string | null;
}

export async function POST(req: Request) {
  if (!env.elevenlabs.live) {
    return NextResponse.json(
      { error: 'elevenlabs_not_configured', message: 'Set ELEVENLABS_API_KEY + ELEVENLABS_AGENT_ID to enable live voice agent.' },
      { status: 503 },
    );
  }

  let body: SignRequest = {};
  try {
    body = (await req.json()) as SignRequest;
  } catch {
    /* empty body is fine */
  }

  try {
    const url = new URL('https://api.elevenlabs.io/v1/convai/conversation/get_signed_url');
    url.searchParams.set('agent_id', env.elevenlabs.agentId!);

    const res = await fetch(url, {
      headers: { 'xi-api-key': env.elevenlabs.apiKey! },
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: 'elevenlabs_upstream_error', status: res.status, detail: text },
        { status: 502 },
      );
    }

    const data = (await res.json()) as { signed_url: string };

    return NextResponse.json({
      signedUrl: data.signed_url,
      agentId: env.elevenlabs.agentId,
      // Surfaced back so the agent can correlate the wss session to a patient.
      patientPubkey: body.patientPubkey ?? null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'sign_failed', message: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
