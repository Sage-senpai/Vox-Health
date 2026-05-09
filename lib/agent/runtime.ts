/**
 * HealthAgent — the long-running session that drives every patient interaction.
 *
 * Lifecycle:
 *   const agent = new HealthAgent({ patientPubkey });
 *   agent.register([elevenlabsTool, noahTool, solanaTool, ledgerTool, virtualsTool]);
 *
 *   // Streaming surface
 *   for await (const event of agent.run({ initialAudio })) {
 *     // render in UI
 *   }
 *
 * The planner decides the next tool to call from the rolling event history.
 * In production that's NoahAI; in dev it's a deterministic walk through
 * transcribe → analyze → seal → settle → notify-if-flagged.
 */

import { nanoid } from './nanoid';
import type {
  AgentEvent,
  AgentSession,
  JsonValue,
  PlanStep,
  ToolContext,
  ToolDefinition,
} from './types';

export type Planner = (history: AgentEvent[], tools: ToolDefinition[]) => Promise<PlanStep | null>;

export interface HealthAgentOptions {
  patientPubkey?: string;
  planner?: Planner;
  /** Hard ceiling on tool calls per session — prevents runaway loops. */
  maxSteps?: number;
}

export class HealthAgent {
  readonly session: AgentSession;
  private tools = new Map<string, ToolDefinition>();
  private planner: Planner;
  private maxSteps: number;

  constructor(opts: HealthAgentOptions = {}) {
    this.session = {
      id: nanoid(),
      startedAt: Date.now(),
      patientPubkey: opts.patientPubkey,
      events: [],
    };
    this.planner = opts.planner ?? defaultPlanner;
    this.maxSteps = opts.maxSteps ?? 12;
  }

  register(tools: ToolDefinition[]): this {
    for (const t of tools) this.tools.set(t.name, t);
    return this;
  }

  /** Snapshot of which tools are wired live vs mocked, for telemetry. */
  toolStatus(): Array<{ name: string; status: 'live' | 'mock' }> {
    return [...this.tools.values()].map((t) => ({ name: t.name, status: t.status }));
  }

  private ctx(): ToolContext {
    return {
      sessionId: this.session.id,
      patientPubkey: this.session.patientPubkey,
      log: (event) => {
        this.session.events.push(event);
      },
      history: () => [...this.session.events],
    };
  }

  /** One-shot tool invocation, useful from React handlers. */
  async call<T = JsonValue>(name: string, input: JsonValue): Promise<T> {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Tool not registered: ${name}`);
    const ctx = this.ctx();
    const ts = Date.now();
    ctx.log({ type: 'tool.call', tool: name, input, ts });
    try {
      const output = (await tool.invoke(input, ctx)) as T;
      ctx.log({ type: 'tool.result', tool: name, output: output as JsonValue, ts: Date.now() });
      return output;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      ctx.log({ type: 'tool.error', tool: name, message, ts: Date.now() });
      throw err;
    }
  }

  /** Drives the planner loop. Yields events as they happen. */
  async *run(seed?: { transcript?: string }): AsyncGenerator<AgentEvent> {
    const ctx = this.ctx();

    if (seed?.transcript) {
      const ev: AgentEvent = {
        type: 'speech.in',
        transcript: seed.transcript,
        durationMs: 0,
        ts: Date.now(),
      };
      ctx.log(ev);
      yield ev;
    }

    for (let step = 0; step < this.maxSteps; step++) {
      const next = await this.planner(ctx.history(), [...this.tools.values()]);
      if (!next) return;

      const tool = this.tools.get(next.tool);
      if (!tool) {
        const ev: AgentEvent = {
          type: 'tool.error',
          tool: next.tool,
          message: `unknown tool`,
          ts: Date.now(),
        };
        ctx.log(ev);
        yield ev;
        return;
      }

      const callEv: AgentEvent = {
        type: 'tool.call',
        tool: next.tool,
        input: next.input,
        ts: Date.now(),
      };
      ctx.log(callEv);
      yield callEv;

      try {
        const output = await tool.invoke(next.input, ctx);
        const resEv: AgentEvent = {
          type: 'tool.result',
          tool: next.tool,
          output: output as JsonValue,
          ts: Date.now(),
        };
        ctx.log(resEv);
        yield resEv;
      } catch (err) {
        const errEv: AgentEvent = {
          type: 'tool.error',
          tool: next.tool,
          message: err instanceof Error ? err.message : String(err),
          ts: Date.now(),
        };
        ctx.log(errEv);
        yield errEv;
        return;
      }
    }
  }
}

/**
 * Deterministic dev-mode planner. Walks the canonical voice → analyze → seal →
 * settle → notify pipeline by inspecting what's already in the history.
 *
 * In production this is replaced by `noahPlanner` (lib/agent/planner-noah.ts)
 * which calls NoahAI for tool selection.
 */
const step = (tool: string, input: Record<string, JsonValue>, reasoning: string): PlanStep => ({
  tool,
  input,
  reasoning,
});

const defaultPlanner: Planner = async (history, tools) => {
  const has = (type: AgentEvent['type'], pred?: (e: AgentEvent) => boolean) =>
    history.some((e) => e.type === type && (!pred || pred(e)));
  const last = <T extends AgentEvent['type']>(type: T) =>
    [...history].reverse().find((e) => e.type === type) as Extract<AgentEvent, { type: T }> | undefined;
  const have = (name: string) => tools.some((t) => t.name === name);
  const calledTool = (name: string) =>
    history.some((e) => e.type === 'tool.call' && e.tool === name);

  // 1. New transcript & no analysis yet → run NoahAI.
  const lastSpeech = last('speech.in');
  if (lastSpeech && !has('flag') && !calledTool('noah.analyze') && have('noah.analyze')) {
    return step('noah.analyze', { transcript: lastSpeech.transcript }, 'New patient input — score severity and surface drug interactions.');
  }

  // 2. Analysis done, not yet sealed → Ledger sign.
  if (has('flag') && !has('seal') && have('ledger.seal')) {
    return step('ledger.seal', { sessionStart: history[0]?.ts ?? 0 }, 'Analysis complete — encrypt + sign on the hardware wallet.');
  }

  // 3. Sealed but not settled → Solana write.
  if (has('seal') && !has('settle') && have('solana.sealEntry')) {
    return step('solana.sealEntry', { sigBase58: last('seal')?.sigBase58 ?? '' }, 'Anchor the sealed pointer to the on-chain timeline.');
  }

  // 4. Settled and severity ≥ 4 → page caregiver via Virtuals.
  const flag = last('flag');
  if (has('settle') && flag && flag.severity >= 4 && have('virtuals.notifyCaregiver')) {
    return step('virtuals.notifyCaregiver', { reason: flag.reason, severity: flag.severity }, 'High-severity entry — page caregiver agent.');
  }

  return null;
};
