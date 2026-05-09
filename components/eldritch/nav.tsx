'use client';

import Link from 'next/link';
import { useState } from 'react';

export function EldritchNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-30">
      <div className="section-shell flex items-center justify-between py-5 md:py-6">
        <Link href="/" className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block w-9 h-9 bg-ink text-paper grid place-items-center font-display font-bold text-base"
            style={{ clipPath: 'var(--vox-notch)' }}
          >
            V
          </span>
          <span className="font-display font-bold tracking-tight text-lg">VoxHealth</span>
          <span className="hidden md:inline-flex glyph-badge ml-2">v0 · Devnet</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-mono uppercase tracking-[0.18em]">
          <a href="#problem" className="hover:text-sage transition-colors">Problem</a>
          <a href="#how" className="hover:text-sage transition-colors">How it works</a>
          <a href="#stack" className="hover:text-sage transition-colors">Stack</a>
          <a href="#tracks" className="hover:text-sage transition-colors">Tracks</a>
          <a href="#patients" className="hover:text-sage transition-colors">Patients</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/app" className="btn-secondary">Open App →</Link>
          <Link href="/onboarding" className="btn-accent">Start Recording</Link>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden w-10 h-10 grid place-items-center border border-ink"
          style={{ clipPath: 'var(--vox-notch)' }}
          onClick={() => setOpen(!open)}
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            {open ? (
              <path d="M2 2 L16 12 M16 2 L2 12" stroke="currentColor" strokeWidth="2" />
            ) : (
              <path d="M0 1h18M0 7h18M0 13h18" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink/10 bg-paper">
          <div className="section-shell flex flex-col gap-3 py-5 text-sm font-mono uppercase tracking-[0.18em]">
            <a href="#problem" onClick={() => setOpen(false)}>Problem</a>
            <a href="#how" onClick={() => setOpen(false)}>How it works</a>
            <a href="#stack" onClick={() => setOpen(false)}>Stack</a>
            <a href="#tracks" onClick={() => setOpen(false)}>Tracks</a>
            <a href="#patients" onClick={() => setOpen(false)}>Patients</a>
            <div className="flex gap-3 mt-3">
              <Link href="/app" className="btn-secondary flex-1">Open App</Link>
              <Link href="/onboarding" className="btn-accent flex-1">Start</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
