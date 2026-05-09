/**
 * LI.FI tools for the HealthAgent.
 *
 * Two tools:
 *  - lifi.quoteSubscription   quote a cross-chain payment from the patient's
 *                             holding chain (e.g. Polygon USDC) into Solana
 *                             USDC for the monthly Pro subscription. Returns
 *                             the route the /billing widget will execute.
 *  - lifi.x402Charge          charge a doctor a sub-cent micro-payment per
 *                             timeline read using the x402 protocol on top
 *                             of LI.FI's Solana coverage.
 *
 * Mock fallback: deterministic synthetic quotes / receipts so the agent
 * loop runs without a live LI.FI integrator.
 */

import { env } from '@/lib/env';
import type { ToolDefinition, ToolStatus } from '../types';

const LIFI_API = 'https://li.quest/v1';

const status = (): ToolStatus => 'live'; // LI.FI quote endpoints work without an API key.

interface QuoteSubscriptionInput {
  fromChainId: number;        // e.g. 137 (Polygon), 1 (Ethereum)
  fromTokenAddress: string;   // ERC-20 address on origin chain
  fromAddress: string;        // EVM wallet
  toAddress: string;          // patient's Solana pubkey
  fromAmountUsd: number;      // e.g. 9 for the $9/mo plan
}
interface QuoteSubscriptionOutput {
  routeId: string;
  fromAmount: string;
  toAmount: string;
  estimatedSeconds: number;
  bridgeUsed: string;
  source: ToolStatus;
}

export const quoteSubscriptionTool: ToolDefinition<QuoteSubscriptionInput, QuoteSubscriptionOutput> = {
  name: 'lifi.quoteSubscription',
  description: 'Quote a cross-chain payment for a VoxHealth subscription, settling on Solana.',
  parameters: {
    fromChainId: 'EVM chain id of the source chain.',
    fromTokenAddress: 'Source ERC-20 token address.',
    fromAddress: 'Source wallet address (EVM).',
    toAddress: 'Destination Solana pubkey (base58).',
    fromAmountUsd: 'USD amount to convert + bridge.',
  },
  status: status(),
  async invoke(input) {
    try {
      const params = new URLSearchParams({
        fromChain: String(input.fromChainId),
        toChain: 'sol',
        fromToken: input.fromTokenAddress,
        toToken: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // Solana USDC mint
        fromAddress: input.fromAddress,
        toAddress: input.toAddress,
        fromAmount: String(Math.round(input.fromAmountUsd * 1e6)),
        integrator: env.lifi.integrator,
      });
      const res = await fetch(`${LIFI_API}/quote?${params}`);
      if (!res.ok) throw new Error(`LI.FI ${res.status}`);
      const data = (await res.json()) as {
        id: string;
        action: { fromAmount: string; toAmount: string };
        estimate: { executionDuration: number };
        toolDetails?: { name: string };
      };
      return {
        routeId: data.id,
        fromAmount: data.action.fromAmount,
        toAmount: data.action.toAmount,
        estimatedSeconds: data.estimate.executionDuration,
        bridgeUsed: data.toolDetails?.name ?? 'unknown',
        source: 'live',
      };
    } catch (err) {
      console.warn('[VoxHealth] LI.FI quote failed, returning mock:', err);
      return {
        routeId: `mock-route-${Date.now()}`,
        fromAmount: String(Math.round(input.fromAmountUsd * 1e6)),
        toAmount: String(Math.round(input.fromAmountUsd * 1e6 * 0.997)),
        estimatedSeconds: 38,
        bridgeUsed: 'mock-bridge',
        source: 'mock',
      };
    }
  },
};

interface X402ChargeInput {
  doctorPubkey: string;
  amountUsd: number;
  reason: string; // e.g. "timeline-read:patient:{pda}"
}
interface X402ChargeOutput {
  receiptId: string;
  amountUsd: number;
  source: ToolStatus;
}

export const x402ChargeTool: ToolDefinition<X402ChargeInput, X402ChargeOutput> = {
  name: 'lifi.x402Charge',
  description: 'Charge a sub-cent x402 micropayment for a single doctor timeline read.',
  parameters: {
    doctorPubkey: 'Base58 doctor wallet pubkey.',
    amountUsd: 'USD amount, typically $0.01 - $0.10.',
    reason: 'Free-text reason recorded on the receipt.',
  },
  status: 'live',
  async invoke(input) {
    // x402 micropayments aren't exposed as a public LI.FI HTTP endpoint yet;
    // we keep the tool surface stable and return a deterministic receipt now,
    // then swap in the real flow once the LI.FI MCP / agent SDK lands.
    const receiptId = `x402-${Date.now().toString(36)}-${input.doctorPubkey.slice(0, 6)}`;
    return { receiptId, amountUsd: input.amountUsd, source: 'mock' };
  },
};

export const lifiTools = [quoteSubscriptionTool, x402ChargeTool];
