/**
 * NoahAI tools — clinical reasoning over the patient's rolling transcript.
 *
 * Two tools:
 *  - noah.analyze       score severity (1-5), surface symptom progression,
 *                       and detect drug interactions. Emits a `flag` event
 *                       so the planner can decide whether to call Virtuals.
 *  - noah.followUp      generate a single empathic follow-up question
 *                       conditioned on the latest transcript. The agent
 *                       speaks this back via elevenlabs.synthesize.
 *
 * Both tools also expose a `noahPlanner` so production deployments can swap
 * the deterministic dev planner for one that asks Noah which tool to call
 * next given the conversation so far.
 */

import { env } from '@/lib/env';
import type { AgentEvent, JsonValue, PlanStep, ToolDefinition, ToolStatus } from '../types';

const status = (): ToolStatus => (env.noah.live ? 'live' : 'mock');

interface AnalyzeInput {
  transcript: string;
  /** Optional list of medications the patient is on, for interaction checks. */
  medications?: string[];
}
interface AnalyzeOutput {
  severity: 1 | 2 | 3 | 4 | 5;
  symptoms: string[];
  reasoning: string;
  interactions: { medication: string; concern: string }[];
  source: ToolStatus;
}

export const analyzeTool: ToolDefinition<AnalyzeInput, AnalyzeOutput> = {
  name: 'noah.analyze',
  description: 'Score severity, extract symptom keywords, and check medication interactions.',
  parameters: {
    transcript: 'The patient utterance to analyze.',
    medications: 'Optional list of current medications for interaction checking.',
  },
  status: status(),
  async invoke(input, ctx) {
    const result = env.noah.live
      ? await callNoah<AnalyzeInput, AnalyzeOutput>('/v1/clinical/analyze', input).catch((err) => {
          console.warn('[VoxHealth] NoahAI analyze failed, using mock:', err);
          return mockAnalyze(input);
        })
      : mockAnalyze(input);

    // Surface a structured flag the planner can react to.
    ctx.log({
      type: 'flag',
      severity: result.severity,
      reason: result.reasoning,
      ts: Date.now(),
    });

    return result;
  },
};

interface FollowUpInput {
  transcript: string;
}
interface FollowUpOutput {
  question: string;
  rationale: string;
  source: ToolStatus;
}

export const followUpTool: ToolDefinition<FollowUpInput, FollowUpOutput> = {
  name: 'noah.followUp',
  description: 'Generate one empathic follow-up question based on the patient utterance.',
  parameters: {
    transcript: 'The patient utterance to respond to.',
  },
  status: status(),
  async invoke(input) {
    if (env.noah.live) {
      try {
        return await callNoah<FollowUpInput, FollowUpOutput>('/v1/clinical/follow-up', input);
      } catch (err) {
        console.warn('[VoxHealth] NoahAI follow-up failed, using mock:', err);
      }
    }
    return mockFollowUp(input);
  },
};

export const noahTools = [analyzeTool, followUpTool];

/**
 * Production planner — asks NoahAI which tool to call next, given the
 * full event history and the current tool registry. Falls back to the
 * runtime's default planner when Noah is unreachable.
 */
export async function noahPlanner(
  history: AgentEvent[],
  tools: ToolDefinition[],
): Promise<PlanStep | null> {
  if (!env.noah.live) return null;
  try {
    const res = await fetch(`${env.noah.apiBase}/v1/agent/plan`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.noah.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        history,
        tools: tools.map((t) => ({
          name: t.name,
          description: t.description,
          parameters: t.parameters,
        })),
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { step: PlanStep | null };
    return data.step;
  } catch {
    return null;
  }
}

// ─── helpers ────────────────────────────────────────────────────────────

async function callNoah<I, O>(path: string, input: I): Promise<O> {
  const res = await fetch(`${env.noah.apiBase}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.noah.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`NoahAI ${path} ${res.status}: ${await res.text()}`);
  return (await res.json()) as O;
}

const SYMPTOM_LEXICON = [
  'pain', 'fatigue', 'headache', 'fever', 'nausea', 'dizziness', 'weakness',
  'anxiety', 'shortness of breath', 'tingling', 'numbness', 'rash', 'swelling',
  'cough', 'chest pain', 'palpitations', 'lightheaded', 'glucose', 'pressure',
];

const SEVERE_TOKENS = ['severe', 'worst', 'unbearable', 'critical', 'extreme', 'crushing', '10/10', 'emergency'];
const MODERATE_TOKENS = ['moderate', 'painful', 'concerning', 'persistent', 'worse', '7/10', '6/10'];
const MILD_TOKENS = ['mild', 'slight', 'a bit', 'small', '2/10', '3/10'];

const KNOWN_INTERACTIONS: Record<string, string[]> = {
  warfarin: ['ibuprofen', 'aspirin'],
  metformin: ['contrast dye'],
  lisinopril: ['potassium supplements'],
  ssri: ['tramadol', 'st johns wort'],
};

function mockAnalyze(input: AnalyzeInput): AnalyzeOutput {
  const t = input.transcript.toLowerCase();
  const symptoms = SYMPTOM_LEXICON.filter((s) => t.includes(s));

  let severity: 1 | 2 | 3 | 4 | 5 = 2;
  let reasoning = 'Routine check-in; no severity markers detected.';

  if (SEVERE_TOKENS.some((tok) => t.includes(tok))) {
    severity = 5;
    reasoning = 'Severe-language markers detected — recommend urgent review.';
  } else if (MODERATE_TOKENS.some((tok) => t.includes(tok))) {
    severity = 4;
    reasoning = 'Moderate-language markers — flag for next clinician visit.';
  } else if (MILD_TOKENS.some((tok) => t.includes(tok))) {
    severity = 2;
    reasoning = 'Mild markers — log to timeline, no escalation needed.';
  } else if (symptoms.length >= 2) {
    severity = 3;
    reasoning = `Multiple symptoms (${symptoms.join(', ')}) — monitor across week.`;
  }

  const interactions: { medication: string; concern: string }[] = [];
  for (const med of input.medications ?? []) {
    const m = med.toLowerCase();
    for (const [drug, conflicts] of Object.entries(KNOWN_INTERACTIONS)) {
      if (m.includes(drug) && conflicts.some((c) => t.includes(c))) {
        interactions.push({
          medication: med,
          concern: `${drug} may interact with mention of ${conflicts.find((c) => t.includes(c))}.`,
        });
      }
    }
  }

  return { severity, symptoms, reasoning, interactions, source: 'mock' };
}

const FOLLOWUP_TEMPLATES: Array<(symptoms: string[]) => string> = [
  (s) => (s.length ? `When did the ${s[0]} start, and is it constant or does it come and go?` : 'When did this start?'),
  (s) => (s.includes('pain') ? 'On a 1–10 scale, how would you rate the pain right now?' : 'How are you feeling compared to yesterday?'),
  () => 'Have you taken anything for it, and did it help?',
  () => 'Anything you ate, did, or felt that you think might be connected?',
];

function mockFollowUp(input: FollowUpInput): FollowUpOutput {
  const symptoms = SYMPTOM_LEXICON.filter((s) => input.transcript.toLowerCase().includes(s));
  const idx = Math.abs(hash(input.transcript)) % FOLLOWUP_TEMPLATES.length;
  return {
    question: FOLLOWUP_TEMPLATES[idx](symptoms),
    rationale: symptoms.length
      ? `Patient mentioned ${symptoms.join(', ')}; following up on the most prominent.`
      : 'No specific symptoms detected; broad open-ended check-in.',
    source: 'mock',
  };
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

// Re-export for convenience
export type { JsonValue };
