/**
 * Mobile Wallet Adapter detection + offline queue.
 *
 * VoxHealth runs in three different wallet environments:
 *   1. Solana Mobile dApp Store browser  → real MWA available
 *   2. Desktop browser w/ Phantom        → window.solana provider
 *   3. Anything else                     → no signer; tools degrade to mock
 *
 * This module exposes:
 *   - detectEnvironment()     identifies which of the three we're in
 *   - getMwaSigner()          dynamic-imports the MWA package only when on
 *                             a Solana Mobile device (so the extra MB never
 *                             ships to desktop bundles)
 *   - offlineQueue            persists unsigned-but-recorded entries to
 *                             localStorage so a rural patient can record
 *                             without connectivity and have the entries
 *                             auto-flush to Solana once the device reconnects.
 */

import { Transaction, PublicKey } from '@solana/web3.js';
import type { WalletSigner } from '@/lib/agent/tools/solana';

export type WalletEnvironment = 'solana-mobile' | 'desktop-phantom' | 'none';

export function detectEnvironment(): WalletEnvironment {
  if (typeof window === 'undefined') return 'none';

  // Solana Mobile dApp Store browser injects a specific UA marker.
  const ua = navigator.userAgent || '';
  if (/SolanaMobile/i.test(ua) || /SeekerOS/i.test(ua)) return 'solana-mobile';

  if ('solana' in window) return 'desktop-phantom';
  return 'none';
}

/**
 * Dynamically loads the MWA package and returns a WalletSigner conforming
 * to the same interface Ledger / Phantom expose. Returns null when not on
 * a Solana Mobile device.
 *
 * The MWA package is large + Android-only; lazy import keeps the desktop
 * bundle clean.
 */
export async function getMwaSigner(): Promise<WalletSigner | null> {
  if (detectEnvironment() !== 'solana-mobile') return null;
  try {
    const { transact } = await import(
      '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
    );
    return {
      // Lazily resolved on first use; MWA gives us the pubkey at authorize time.
      publicKey: new PublicKey('11111111111111111111111111111111'),
      async signTransaction(tx: Transaction) {
        return await transact(async (wallet) => {
          await wallet.authorize({
            cluster: 'devnet',
            identity: { name: 'VoxHealth', uri: 'https://voxhealth.app' },
          });
          const [signed] = await wallet.signTransactions({ transactions: [tx] });
          return signed;
        });
      },
    };
  } catch (err) {
    console.warn('[VoxHealth] MWA import failed:', err);
    return null;
  }
}

// ─── Offline entry queue ───────────────────────────────────────────────

const QUEUE_KEY = 'voxhealth.offline-queue.v1';

export interface QueuedEntry {
  id: string;
  cid: string;
  sigBase58: string;
  severity: 1 | 2 | 3 | 4 | 5;
  recordedAt: number;
  queuedAt: number;
}

export const offlineQueue = {
  /** Append an entry to the queue. Survives reload + airplane mode. */
  enqueue(entry: Omit<QueuedEntry, 'id' | 'queuedAt'>): QueuedEntry {
    const queued: QueuedEntry = {
      ...entry,
      id: `q-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      queuedAt: Date.now(),
    };
    const all = offlineQueue.peek();
    all.push(queued);
    persist(all);
    return queued;
  },
  peek(): QueuedEntry[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]') as QueuedEntry[];
    } catch {
      return [];
    }
  },
  remove(id: string) {
    persist(offlineQueue.peek().filter((e) => e.id !== id));
  },
  clear() {
    persist([]);
  },
  /**
   * Flush the queue by passing each entry to `seal`. Stops on the first error
   * and leaves the rest queued; the caller can retry next time the network
   * is up. Useful as an effect on `window.online` / `navigator.onLine`.
   */
  async flush(seal: (entry: QueuedEntry) => Promise<void>): Promise<{ flushed: number; remaining: number }> {
    const queue = offlineQueue.peek();
    let flushed = 0;
    for (const entry of queue) {
      try {
        await seal(entry);
        offlineQueue.remove(entry.id);
        flushed++;
      } catch (err) {
        console.warn('[VoxHealth] Offline flush stopped at entry', entry.id, err);
        break;
      }
    }
    return { flushed, remaining: offlineQueue.peek().length };
  },
};

function persist(all: QueuedEntry[]) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(all));
  } catch (err) {
    console.warn('[VoxHealth] Offline queue persist failed:', err);
  }
}
