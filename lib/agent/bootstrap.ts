/**
 * Bootstrap a fully-loaded HealthAgent — every sponsor tool registered,
 * production planner if NoahAI is configured, deterministic walker otherwise.
 *
 * Browser-safe: every tool already guards SSR-unsafe APIs. Server callers
 * (e.g. an API route running the agent end-to-end for a cron job) can call
 * this too — they'll get the mock paths for any browser-only tool.
 */

import { HealthAgent } from './runtime';
import { elevenlabsTools } from './tools/elevenlabs';
import { ledgerTools } from './tools/ledger';
import { mobileTools } from './tools/mobile';
import { noahPlanner, noahTools } from './tools/noah';
import { solanaTools } from './tools/solana';
import { virtualsTools } from './tools/virtuals';
import { lifiTools } from './tools/lifi';
import { env } from '@/lib/env';

export interface BootstrapOptions {
  patientPubkey?: string;
  /** Force the deterministic dev planner even if NoahAI is configured. */
  forceLocalPlanner?: boolean;
}

export function bootstrapHealthAgent(opts: BootstrapOptions = {}): HealthAgent {
  const planner =
    !opts.forceLocalPlanner && env.noah.live ? noahPlanner : undefined;

  const agent = new HealthAgent({
    patientPubkey: opts.patientPubkey,
    planner,
  });

  agent.register([
    ...elevenlabsTools,
    ...noahTools,
    ...ledgerTools,
    ...solanaTools,
    ...mobileTools,
    ...virtualsTools,
    ...lifiTools,
  ]);

  return agent;
}
