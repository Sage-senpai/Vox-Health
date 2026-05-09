'use client';

import { useEffect, useRef, useState } from 'react';

import { bootstrapHealthAgent } from '@/lib/agent/bootstrap';
import type { HealthAgent } from '@/lib/agent/runtime';
import type { AgentEvent } from '@/lib/agent/types';

/**
 * useHealthAgent — gives a React component a lazily-instantiated agent +
 * a live event stream.
 *
 * The agent is created once per component tree and persists across renders;
 * every event the agent logs is reflected back into React state so the UI
 * can show live "Sealing on Ledger…", "Settling on Solana…" status.
 */
export function useHealthAgent(opts?: { patientPubkey?: string }) {
  const ref = useRef<HealthAgent | null>(null);
  const [events, setEvents] = useState<AgentEvent[]>([]);

  if (!ref.current) {
    const agent = bootstrapHealthAgent({ patientPubkey: opts?.patientPubkey });
    // Patch agent.session.events.push to mirror into React state.
    const originalPush = agent.session.events.push.bind(agent.session.events);
    agent.session.events.push = (...newEvents) => {
      const len = originalPush(...newEvents);
      setEvents((prev) => [...prev, ...newEvents]);
      return len;
    };
    ref.current = agent;
  }

  // Auto-flush the offline queue when connectivity returns.
  useEffect(() => {
    const onOnline = () => {
      void ref.current?.call('mobile.flushOfflineQueue', {});
    };
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, []);

  return {
    agent: ref.current,
    events,
    toolStatus: ref.current.toolStatus(),
  };
}
