/**
 * Core types for the VoxHealth agent runtime.
 *
 * The runtime is intentionally provider-neutral. Tools are just async
 * functions with a JSON-Schema-ish parameter shape; the planner (NoahAI in
 * production, a deterministic stub in dev) decides which tool to call next.
 */

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [k: string]: JsonValue };

export type ToolStatus = 'live' | 'mock';

export interface ToolDefinition<TInput = JsonValue, TOutput = JsonValue> {
  /** Stable identifier, e.g. `elevenlabs.transcribe`, `solana.sealEntry`. */
  name: string;
  /** One sentence; surfaced to the planner. */
  description: string;
  /** Loose parameter schema — keys + a one-line hint each. */
  parameters: Record<string, string>;
  /** Whether this tool is wired to a real API or its mock implementation. */
  status: ToolStatus;
  /** Implementation. Throw to surface an error to the planner. */
  invoke: (input: TInput, ctx: ToolContext) => Promise<TOutput>;
}

export interface ToolContext {
  /** Stable session id; used to correlate logs + on-chain entries. */
  sessionId: string;
  /** The patient pubkey when a wallet is connected. */
  patientPubkey?: string;
  /** Append a structured event to the session transcript. */
  log: (event: AgentEvent) => void;
  /** Read-only snapshot of recent events the planner can reason over. */
  history: () => AgentEvent[];
}

export type AgentEvent =
  | { type: 'speech.in'; transcript: string; durationMs: number; ts: number }
  | { type: 'speech.out'; text: string; ts: number }
  | { type: 'tool.call'; tool: string; input: JsonValue; ts: number }
  | { type: 'tool.result'; tool: string; output: JsonValue; ts: number }
  | { type: 'tool.error'; tool: string; message: string; ts: number }
  | { type: 'flag'; severity: 1 | 2 | 3 | 4 | 5; reason: string; ts: number }
  | { type: 'seal'; sigBase58: string; ts: number }
  | { type: 'settle'; txSignature: string; cluster: string; ts: number };

export interface AgentSession {
  id: string;
  startedAt: number;
  patientPubkey?: string;
  events: AgentEvent[];
}

/** A planning step produced by NoahAI (or its mock). */
export interface PlanStep {
  tool: string;
  input: JsonValue;
  reasoning: string;
}
