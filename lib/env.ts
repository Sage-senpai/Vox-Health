/**
 * Typed environment access with graceful fallback.
 *
 * Every integration in lib/agent/tools/* checks `env.<service>.live` to decide
 * whether to call the real API or its mock implementation. Missing keys are
 * never fatal — the agent loop runs end-to-end with mocks alone.
 */

const read = (key: string): string | undefined => {
  if (typeof process === 'undefined') return undefined;
  const v = process.env[key];
  return v && v.trim() ? v.trim() : undefined;
};

const ELEVENLABS_API_KEY = read('ELEVENLABS_API_KEY');
const ELEVENLABS_AGENT_ID = read('ELEVENLABS_AGENT_ID');
const NOAH_API_KEY = read('NOAH_API_KEY');
const NOAH_API_BASE = read('NOAH_API_BASE') ?? 'https://api.trynoah.ai';
const SOLANA_CLUSTER = read('NEXT_PUBLIC_SOLANA_CLUSTER') ?? 'devnet';
const SOLANA_RPC = read('NEXT_PUBLIC_SOLANA_RPC') ?? 'https://api.devnet.solana.com';
const VOXHEALTH_PROGRAM_ID = read('NEXT_PUBLIC_VOXHEALTH_PROGRAM_ID');
const LEDGER_ENABLED = read('NEXT_PUBLIC_LEDGER_ENABLED') === 'true';
const LIFI_INTEGRATOR = read('NEXT_PUBLIC_LIFI_INTEGRATOR') ?? 'voxhealth';
const VIRTUALS_AGENT_KEY = read('VIRTUALS_AGENT_KEY');
const VIRTUALS_WEBHOOK_URL = read('VIRTUALS_WEBHOOK_URL');

export const env = {
  elevenlabs: {
    live: !!ELEVENLABS_API_KEY && !!ELEVENLABS_AGENT_ID,
    apiKey: ELEVENLABS_API_KEY,
    agentId: ELEVENLABS_AGENT_ID,
  },
  noah: {
    live: !!NOAH_API_KEY,
    apiKey: NOAH_API_KEY,
    apiBase: NOAH_API_BASE,
  },
  solana: {
    cluster: SOLANA_CLUSTER as 'devnet' | 'testnet' | 'mainnet-beta',
    rpc: SOLANA_RPC,
    programId: VOXHEALTH_PROGRAM_ID,
    deployed: !!VOXHEALTH_PROGRAM_ID,
  },
  ledger: {
    enabled: LEDGER_ENABLED,
  },
  lifi: {
    integrator: LIFI_INTEGRATOR,
  },
  virtuals: {
    live: !!VIRTUALS_AGENT_KEY && !!VIRTUALS_WEBHOOK_URL,
    apiKey: VIRTUALS_AGENT_KEY,
    webhookUrl: VIRTUALS_WEBHOOK_URL,
  },
} as const;

export type Env = typeof env;

/** Single helper for telemetry — which integrations are live right now. */
export function liveIntegrations(): string[] {
  return [
    env.elevenlabs.live && 'elevenlabs',
    env.noah.live && 'noah',
    env.solana.deployed && 'solana',
    env.ledger.enabled && 'ledger',
    env.virtuals.live && 'virtuals',
  ].filter(Boolean) as string[];
}
