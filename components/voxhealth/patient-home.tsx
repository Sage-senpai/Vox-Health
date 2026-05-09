'use client';

import { useEffect, useState } from 'react';
import { AgenticOrb } from './agentic-orb';
import { TrustStrip } from './trust-strip';

export function PatientHome() {
  const userName = 'Margaret';
  const [greeting, setGreeting] = useState('Hello');
  const [today, setToday] = useState('');

  useEffect(() => {
    setGreeting(getGreeting());
    setToday(todayLabel());
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Top navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-paper/80 border-b border-rule">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md border border-rule bg-linen flex items-center justify-center">
              <span className="font-serif font-bold text-sage text-base leading-none">V</span>
            </div>
            <span className="font-serif text-xl font-bold text-ink tracking-tight">VoxHealth</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-ink-subtle font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
              Synced • Ledger
            </div>
            <div className="w-10 h-10 rounded-full bg-linen border border-rule flex items-center justify-center text-sm font-semibold text-ink-muted">
              M
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden grain bg-hero-aurora">
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
            {/* Greeting */}
            <div className="md:col-span-7 animate-float-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-soft text-sage text-xs font-semibold uppercase tracking-[0.18em] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                {today || ' '}
              </div>
              <h1 className="display-xl text-ink mb-6">
                {greeting}, <span className="italic text-sage">{userName}</span>.
              </h1>
              <p className="text-lg md:text-xl font-normal text-ink-muted leading-relaxed max-w-xl">
                How are you feeling today? Tap the orb and tell me — I&apos;ll listen, ask the right
                follow-ups, and add it to your timeline.
              </p>

              <div className="mt-10 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo" /> Encrypted
                </span>
                <span className="opacity-40">/</span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber" /> On-chain
                </span>
                <span className="opacity-40">/</span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage" /> Doctor-shareable
                </span>
              </div>
            </div>

            {/* Orb */}
            <div className="md:col-span-5 flex justify-center md:justify-end">
              <div className="relative animate-float-up" style={{ animationDelay: '0.15s' }}>
                <div className="absolute inset-0 -m-12 rounded-full bg-orb-glow blur-2xl animate-breathe" />
                <div className="relative">
                  <AgenticOrb />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hairline divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rule to-transparent" />
      </section>

      {/* Today snapshot */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="display-m text-ink">Today</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-subtle">
            Snapshot
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {/* Medications */}
          <article className="group relative p-7 md:p-8 rounded-[18px] bg-linen border border-rule hover:border-sage transition-colors">
            <div className="flex items-baseline justify-between mb-5">
              <h3 className="font-serif text-xl font-bold text-ink">Medications</h3>
              <span className="text-xs font-semibold uppercase tracking-wider text-sage">3 doses</span>
            </div>
            <ul className="space-y-3">
              {[
                { time: '8:00 AM', name: 'Metformin', taken: true },
                { time: '2:00 PM', name: 'Lisinopril', taken: false },
                { time: '8:00 PM', name: 'Atorvastatin', taken: false },
              ].map((dose) => (
                <li key={dose.time} className="flex items-center justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium text-ink">{dose.name}</span>
                    <span className="text-xs text-ink-subtle font-medium">{dose.time}</span>
                  </div>
                  <span
                    className={`w-5 h-5 rounded-full border-2 transition-colors ${
                      dose.taken ? 'bg-sage border-sage' : 'border-rule group-hover:border-sage'
                    }`}
                    aria-label={dose.taken ? 'Taken' : 'Not yet taken'}
                  />
                </li>
              ))}
            </ul>
          </article>

          {/* Last entry */}
          <article className="p-7 md:p-8 rounded-[18px] bg-linen border border-rule">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              Last entry
            </span>
            <p className="vital text-ink mt-3" style={{ fontSize: '2.75rem' }}>
              8h
            </p>
            <p className="text-sm text-ink-muted mt-3 leading-relaxed">
              &ldquo;Mild shoulder pain after gardening. Better with rest.&rdquo;
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sage">
              <span className="w-1.5 h-1.5 rounded-full bg-sage" />
              Severity 3 / 10
            </div>
          </article>

          {/* Streak */}
          <article className="p-7 md:p-8 rounded-[18px] bg-ink text-paper border border-ink relative overflow-hidden">
            <div
              className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-30 blur-2xl"
              style={{ background: 'radial-gradient(circle, var(--sage) 0%, transparent 70%)' }}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-paper/60">
              Voice journaling streak
            </span>
            <p className="vital mt-3" style={{ fontSize: '3.25rem' }}>
              23<span className="text-paper/40 text-2xl font-normal align-top ml-1">days</span>
            </p>
            <p className="text-sm text-paper/70 mt-4 leading-relaxed">
              You&apos;ve checked in every morning this month. Dr. Chen sees a steady downward trend
              in your reported pain.
            </p>
          </article>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-t border-rule bg-linen/40">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-3 gap-10 md:gap-14">
            {pillars.map((pillar) => (
              <div key={pillar.title}>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sage mb-4">
                  {pillar.kicker}
                </div>
                <h3 className="font-serif text-2xl font-bold text-ink mb-3 leading-tight">
                  {pillar.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustStrip />
    </div>
  );
}

const pillars = [
  {
    kicker: 'Voice-first',
    title: 'Your voice is the interface',
    body:
      '30-second daily check-ins. ElevenLabs transcribes. NoahAI flags patterns. No typing, no menus, no friction.',
  },
  {
    kicker: 'Patient-owned',
    title: 'Encrypted on your Ledger',
    body:
      'Your medical history is sealed by your hardware wallet. No hospital, no cloud provider, no insurer holds the key — only you.',
  },
  {
    kicker: 'Portable',
    title: 'Doctors scan, not request',
    body:
      'Generate a one-time QR. Any provider sees your full timeline for the window you choose. Then access expires automatically.',
  },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Still up';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function todayLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
