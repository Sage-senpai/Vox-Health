/**
 * Solana Mobile tools — bridge the WalletEnvironment + offline queue into
 * the HealthAgent surface.
 *
 *  - mobile.detectEnvironment   one-shot check; returned string drives UI.
 *  - mobile.queueOfflineEntry   when sealEntry can't reach the chain, the
 *                                pipeline writes here so the entry isn't lost.
 *  - mobile.flushOfflineQueue   callable from a "Sync now" button or a
 *                                window.online effect.
 */

import { detectEnvironment, offlineQueue, type QueuedEntry } from '@/lib/solana/mwa';
import type { ToolDefinition, ToolStatus } from '../types';

const status: ToolStatus = 'live'; // detection + queue work everywhere

export const detectEnvironmentTool: ToolDefinition<Record<string, never>, { env: string; source: ToolStatus }> = {
  name: 'mobile.detectEnvironment',
  description: 'Identify whether we are inside the Solana Mobile dApp Store browser, desktop Phantom, or no wallet.',
  parameters: {},
  status,
  async invoke() {
    return { env: detectEnvironment(), source: status };
  },
};

interface QueueInput {
  cid: string;
  sigBase58: string;
  severity: 1 | 2 | 3 | 4 | 5;
  recordedAt?: number;
}
interface QueueOutput {
  queuedId: string;
  queueDepth: number;
  source: ToolStatus;
}

export const queueOfflineEntryTool: ToolDefinition<QueueInput, QueueOutput> = {
  name: 'mobile.queueOfflineEntry',
  description: 'Persist a sealed-but-unsettled entry to the offline queue for later flush.',
  parameters: {
    cid: 'Off-chain content id.',
    sigBase58: 'Ledger Ed25519 signature, base58.',
    severity: '1-5 from NoahAI analysis.',
    recordedAt: 'Optional unix-seconds timestamp.',
  },
  status,
  async invoke(input) {
    const queued = offlineQueue.enqueue({
      cid: input.cid,
      sigBase58: input.sigBase58,
      severity: input.severity,
      recordedAt: input.recordedAt ?? Math.floor(Date.now() / 1000),
    });
    return {
      queuedId: queued.id,
      queueDepth: offlineQueue.peek().length,
      source: status,
    };
  },
};

interface FlushOutput {
  flushed: number;
  remaining: number;
  source: ToolStatus;
}

export const flushOfflineQueueTool: ToolDefinition<Record<string, never>, FlushOutput> = {
  name: 'mobile.flushOfflineQueue',
  description: 'Replay queued entries through solana.sealEntry, popping each on success.',
  parameters: {},
  status,
  async invoke(_input, ctx) {
    // The actual seal call is supplied by the caller — we expose a hook
    // pattern via window so the UI can attach its real seal function.
    const sealFn = (globalThis as { __voxhealthSeal__?: (e: QueuedEntry) => Promise<void> })
      .__voxhealthSeal__;
    if (!sealFn) {
      return { flushed: 0, remaining: offlineQueue.peek().length, source: status };
    }
    const result = await offlineQueue.flush(async (entry) => {
      ctx.log({
        type: 'tool.call',
        tool: 'solana.sealEntry',
        input: { cid: entry.cid, sigBase58: entry.sigBase58, severity: entry.severity },
        ts: Date.now(),
      });
      await sealFn(entry);
    });
    return { ...result, source: status };
  },
};

export const mobileTools = [detectEnvironmentTool, queueOfflineEntryTool, flushOfflineQueueTool];
