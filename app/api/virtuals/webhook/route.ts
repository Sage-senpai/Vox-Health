/**
 * Inbound webhook from the Virtuals caregiver runtime.
 *
 * The on-prem ROS 2 node POSTs here when:
 *   - a caregiver acknowledges a notification
 *   - a pharmacy refill is dispensed
 *   - a robot home-visit is dispatched / arrives
 *
 * We accept the receipt, persist it on the patient's timeline (in production
 * this would write to Solana via solana.sealEntry; for the demo we just log
 * + return 200 so the upstream knows the message was received).
 */

import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export const runtime = 'nodejs';

interface WebhookPayload {
  receiptId: string;
  patientPubkey?: string;
  channel: 'sms' | 'voice' | 'pharmacy' | 'home-visit' | 'robot-visit';
  status: 'dispatched' | 'acknowledged' | 'completed' | 'failed';
  detail?: string;
  ts: string;
}

export async function POST(req: Request) {
  // Optional: verify a shared-secret header so randos can't post here.
  const secret = req.headers.get('x-virtuals-secret');
  if (env.virtuals.live && secret !== env.virtuals.apiKey) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = (await req.json()) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 });
  }

  // In production: append a `caregiver.event` AgentEvent to the patient's
  // session and optionally seal it on-chain. For the demo we just log.
  console.log('[VoxHealth] Virtuals webhook:', payload);

  return NextResponse.json({
    ok: true,
    receivedAt: new Date().toISOString(),
    receiptId: payload.receiptId,
  });
}
