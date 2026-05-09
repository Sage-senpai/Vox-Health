/**
 * Smoke test for the agent runtime — drives one full pipeline cycle and prints
 * which integrations went live vs mock.
 *
 *   pnpm exec tsx scripts/verify-integration.ts
 *
 * No env vars required. Sets ELEVENLABS_API_KEY, NOAH_API_KEY, etc. flips
 * the corresponding tools to live and you'll see the mode in the output.
 */

import { bootstrapHealthAgent } from '../lib/agent/bootstrap';
import { liveIntegrations } from '../lib/env';
import { buildEntryEnvelope, uploadEntry } from '../lib/storage';

async function main() {
  console.log('─── VoxHealth integration smoke test ────────────────────────');
  console.log('Live integrations:', liveIntegrations().join(', ') || 'none (full mock mode)');

  const agent = bootstrapHealthAgent({ patientPubkey: 'demoPatient11111111111111111111' });
  const tools = agent.toolStatus();
  console.log(`Registered tools: ${tools.length}`);
  for (const t of tools) console.log(`  · ${t.status === 'live' ? '✓' : '○'} ${t.name}`);
  console.log();

  // Simulated audio (the mock STT only inspects length).
  const audioBase64 = Buffer.from('synthetic audio bytes').toString('base64');

  console.log('1/5 transcribe…');
  const transcribe = await agent.call<{ transcript: string; source: string }>(
    'elevenlabs.transcribe',
    { audioBase64, mimeType: 'audio/webm' },
  );
  console.log(`     → "${transcribe.transcript}" (${transcribe.source})`);

  console.log('2/5 analyze…');
  const analyze = await agent.call<{ severity: number; reasoning: string; source: string }>(
    'noah.analyze',
    { transcript: transcribe.transcript, medications: ['Metformin', 'Lisinopril'] },
  );
  console.log(`     → severity ${analyze.severity}: ${analyze.reasoning} (${analyze.source})`);

  console.log('3/5 storage upload…');
  const envelope = buildEntryEnvelope({
    patientPubkey: 'demoPatient11111111111111111111',
    transcript: transcribe.transcript,
    audioBase64,
    severity: analyze.severity as 1 | 2 | 3 | 4 | 5,
    recordedAt: Math.floor(Date.now() / 1000),
  });
  const upload = await uploadEntry({ data: envelope });
  console.log(`     → cid ${upload.cid} (${upload.bytes} bytes, ${upload.source})`);

  console.log('4/5 ledger.seal…');
  const seal = await agent.call<{ sigBase58: string; source: string }>('ledger.seal', {
    envelope: `${upload.cid}|patient|${Date.now()}`,
  });
  console.log(`     → ${seal.sigBase58.slice(0, 24)}… (${seal.source})`);

  console.log('5/5 solana.sealEntry…');
  const settle = await agent.call<{ txSignature: string; cluster: string; source: string }>(
    'solana.sealEntry',
    {
      cid: upload.cid,
      sigBase58: seal.sigBase58,
      severity: analyze.severity,
      recordedAt: Math.floor(Date.now() / 1000),
    },
  );
  console.log(`     → tx ${settle.txSignature.slice(0, 12)}… on ${settle.cluster} (${settle.source})`);

  if (analyze.severity >= 4) {
    console.log();
    console.log('Severity ≥ 4 → paging caregiver via Virtuals…');
    const notify = await agent.call<{ receiptId: string; dispatched: string[]; source: string }>(
      'virtuals.notifyCaregiver',
      { reason: analyze.reasoning, severity: analyze.severity },
    );
    console.log(`     → receipt ${notify.receiptId} via [${notify.dispatched.join(', ')}] (${notify.source})`);
  }

  console.log();
  console.log('✓ Pipeline complete. Session has', agent.session.events.length, 'events.');
}

main().catch((err) => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
