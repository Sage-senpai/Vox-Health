/**
 * Virtuals tools — push intelligent agents into the patient's physical world.
 *
 * Two tools:
 *  - virtuals.notifyCaregiver  page the patient's caregiver via the Virtuals
 *                              webhook, optionally including a pharmacy
 *                              refill request payload.
 *  - virtuals.scheduleRobotVisit (stub) request a home-visit from a partnered
 *                              ROS 2 caregiver robot when severity hits 5.
 *
 * The webhook contract is intentionally simple JSON — the on-prem caregiver
 * runtime ROS 2 node receives it, decides whether to dispatch a human or an
 * actuator, and posts back a receipt id we attach to the AgentEvent stream.
 */

import { env } from '@/lib/env';
import type { ToolDefinition, ToolStatus } from '../types';

const status = (): ToolStatus => (env.virtuals.live ? 'live' : 'mock');

interface NotifyInput {
  reason: string;
  severity: 1 | 2 | 3 | 4 | 5;
  patientPubkey?: string;
  channels?: ('sms' | 'voice' | 'pharmacy' | 'home-visit')[];
}
interface NotifyOutput {
  receiptId: string;
  dispatched: string[];
  source: ToolStatus;
}

export const notifyCaregiverTool: ToolDefinition<NotifyInput, NotifyOutput> = {
  name: 'virtuals.notifyCaregiver',
  description: 'Page the caregiver agent with a severity-tagged event, optionally requesting pharmacy or home-visit channels.',
  parameters: {
    reason: 'Human-readable reason from NoahAI analysis.',
    severity: '1-5; the agent uses this to escalate channel choice.',
    patientPubkey: 'Optional patient identifier the agent uses to look up contacts.',
    channels: 'Optional override of which channels to dispatch through.',
  },
  status: status(),
  async invoke(input) {
    const channels =
      input.channels ??
      (input.severity >= 5
        ? (['sms', 'voice', 'pharmacy', 'home-visit'] as const)
        : input.severity >= 4
        ? (['sms', 'voice'] as const)
        : (['sms'] as const));

    if (!env.virtuals.live) {
      return {
        receiptId: `mock-virtuals-${Date.now().toString(36)}`,
        dispatched: [...channels],
        source: 'mock',
      };
    }

    try {
      const res = await fetch(env.virtuals.webhookUrl!, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.virtuals.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'voxhealth',
          severity: input.severity,
          reason: input.reason,
          patientPubkey: input.patientPubkey ?? null,
          channels,
          ts: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`Virtuals ${res.status}`);
      const data = (await res.json()) as { receiptId: string; dispatched: string[] };
      return {
        receiptId: data.receiptId,
        dispatched: data.dispatched,
        source: 'live',
      };
    } catch (err) {
      console.warn('[VoxHealth] Virtuals notify failed, returning mock receipt:', err);
      return {
        receiptId: `mock-virtuals-${Date.now().toString(36)}`,
        dispatched: [...channels],
        source: 'mock',
      };
    }
  },
};

interface RobotVisitInput {
  patientPubkey?: string;
  reason: string;
  preferredWindowIso: string; // ISO-8601 desired arrival window
}
interface RobotVisitOutput {
  bookingId: string;
  etaIso: string;
  source: ToolStatus;
}

export const scheduleRobotVisitTool: ToolDefinition<RobotVisitInput, RobotVisitOutput> = {
  name: 'virtuals.scheduleRobotVisit',
  description: 'Request a partnered ROS 2 caregiver robot home visit for severity-5 events.',
  parameters: {
    patientPubkey: 'Optional patient identifier.',
    reason: 'Why a visit is being requested.',
    preferredWindowIso: 'Patient-preferred ISO-8601 arrival window.',
  },
  status: status(),
  async invoke(input) {
    if (!env.virtuals.live) {
      const eta = new Date(Date.parse(input.preferredWindowIso) || Date.now() + 90 * 60_000);
      return {
        bookingId: `mock-visit-${Date.now().toString(36)}`,
        etaIso: eta.toISOString(),
        source: 'mock',
      };
    }
    try {
      const res = await fetch(`${env.virtuals.webhookUrl}/robot-visit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.virtuals.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(`Virtuals robot-visit ${res.status}`);
      const data = (await res.json()) as { bookingId: string; etaIso: string };
      return { ...data, source: 'live' };
    } catch (err) {
      console.warn('[VoxHealth] Robot visit booking failed:', err);
      return {
        bookingId: `mock-visit-${Date.now().toString(36)}`,
        etaIso: new Date(Date.now() + 90 * 60_000).toISOString(),
        source: 'mock',
      };
    }
  },
};

export const virtualsTools = [notifyCaregiverTool, scheduleRobotVisitTool];
