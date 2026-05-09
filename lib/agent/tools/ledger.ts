/**
 * Ledger tools for the HealthAgent.
 *
 * Two tools:
 *  - ledger.connect  open a WebHID transport, wake the Solana app, return
 *                    the patient's Ed25519 pubkey at the standard derivation
 *                    path. This pubkey is the one stored in Patient.ledger_pubkey
 *                    on Solana so the on-chain record is verifiably linked
 *                    to a hardware-held key.
 *  - ledger.seal     sign an entry envelope (cid || patient || sequence) on
 *                    the device. Returns a base58 signature the solana.sealEntry
 *                    tool drops into the Anchor instruction.
 *
 * @ledgerhq/hw-* packages are heavyweight and browser-only — we lazy-load
 * them via dynamic import so SSR + Node tests stay fast and the bundle only
 * pulls them on routes that touch the Ledger.
 *
 * Mock fallback when WebHID is unavailable: deterministic 64-byte signature
 * derived from the envelope hash. Lets the agent loop run end-to-end on
 * desktops without the device + on iOS Safari (no WebHID).
 */

import bs58 from 'bs58';

import { env } from '@/lib/env';
import type { ToolDefinition, ToolStatus } from '../types';

const SOLANA_DERIVATION_PATH = "44'/501'/0'/0'";

const status = (): ToolStatus =>
  env.ledger.enabled && typeof navigator !== 'undefined' && 'hid' in navigator ? 'live' : 'mock';

interface ConnectInput {
  derivationPath?: string;
}
interface ConnectOutput {
  pubkeyBase58: string;
  derivationPath: string;
  source: ToolStatus;
}

export const connectTool: ToolDefinition<ConnectInput, ConnectOutput> = {
  name: 'ledger.connect',
  description: 'Open a WebHID connection to a Ledger device and read the Solana pubkey.',
  parameters: {
    derivationPath: 'Optional BIP-44 path (defaults to 44\'/501\'/0\'/0\').',
  },
  status: status(),
  async invoke(input) {
    const path = input.derivationPath ?? SOLANA_DERIVATION_PATH;

    if (status() === 'mock') {
      return {
        pubkeyBase58: mockPubkey(path),
        derivationPath: path,
        source: 'mock',
      };
    }

    try {
      const TransportWebHid = (await import('@ledgerhq/hw-transport-webhid')).default;
      const Solana = (await import('@ledgerhq/hw-app-solana')).default;
      const transport = await TransportWebHid.create();
      try {
        const solana = new Solana(transport);
        const { address } = await solana.getAddress(path);
        return {
          pubkeyBase58: bs58.encode(address),
          derivationPath: path,
          source: 'live',
        };
      } finally {
        await transport.close();
      }
    } catch (err) {
      console.warn('[VoxHealth] Ledger connect failed, returning mock pubkey:', err);
      return { pubkeyBase58: mockPubkey(path), derivationPath: path, source: 'mock' };
    }
  },
};

interface SealInput {
  /** UTF-8 envelope to sign: typically `${cid}|${patientPubkey}|${sequence}`. */
  envelope: string;
  derivationPath?: string;
}
interface SealOutput {
  sigBase58: string;
  derivationPath: string;
  source: ToolStatus;
}

export const sealTool: ToolDefinition<SealInput, SealOutput> = {
  name: 'ledger.seal',
  description: 'Sign an entry envelope on the Ledger device using Ed25519.',
  parameters: {
    envelope: 'UTF-8 string to sign — usually `cid|patient|sequence`.',
    derivationPath: 'Optional BIP-44 path.',
  },
  status: status(),
  async invoke(input, ctx) {
    const path = input.derivationPath ?? SOLANA_DERIVATION_PATH;
    const message = new TextEncoder().encode(input.envelope);

    let sig: Uint8Array;
    let source: ToolStatus = 'mock';

    if (status() === 'live') {
      try {
        const TransportWebHid = (await import('@ledgerhq/hw-transport-webhid')).default;
        const Solana = (await import('@ledgerhq/hw-app-solana')).default;
        const transport = await TransportWebHid.create();
        try {
          const solana = new Solana(transport);
          const { signature } = await solana.signOffchainMessage(path, Buffer.from(message));
          sig = signature;
          source = 'live';
        } finally {
          await transport.close();
        }
      } catch (err) {
        console.warn('[VoxHealth] Ledger seal failed, falling back to mock sig:', err);
        sig = mockSignature(input.envelope);
      }
    } else {
      sig = mockSignature(input.envelope);
    }

    const sigBase58 = bs58.encode(sig);
    ctx.log({ type: 'seal', sigBase58, ts: Date.now() });
    return { sigBase58, derivationPath: path, source };
  },
};

export const ledgerTools = [connectTool, sealTool];

// ─── helpers ───────────────────────────────────────────────────────────

function mockPubkey(path: string): string {
  // Deterministic 32 bytes derived from the path, encoded as base58.
  return bs58.encode(stretch(path, 32));
}

function mockSignature(envelope: string): Uint8Array {
  return stretch(envelope, 64);
}

function stretch(seed: string, len: number): Uint8Array {
  const out = new Uint8Array(len);
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h = ((h ^ seed.charCodeAt(i)) * 16777619) >>> 0;
  }
  for (let i = 0; i < len; i++) {
    h = ((h ^ (i + 1)) * 16777619) >>> 0;
    out[i] = h & 0xff;
  }
  return out;
}
