import Link from 'next/link';

export function FinalCta() {
  return (
    <section className="relative z-10 py-16 sm:py-24 md:py-32 2xl:py-40 border-t border-ink/10 overflow-hidden">
      {/* Aurora wash */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            'radial-gradient(60% 80% at 20% 30%, rgba(46,126,111,0.18) 0%, transparent 60%), radial-gradient(50% 70% at 80% 70%, rgba(45,63,143,0.14) 0%, transparent 55%)',
        }}
      />

      <div className="section-shell">
        <div className="ink-panel p-6 sm:p-10 md:p-16 2xl:p-20 text-center">
          <div className="flex justify-center mb-6">
            <span className="glyph-badge glyph-badge-accent">Ledger · ElevenLabs · Solana</span>
          </div>

          <h2 className="display-xl shadow-word">
            Your voice.
            <br />
            <span className="text-sage italic">Your record.</span>
          </h2>

          <div className="rune-rule my-8 max-w-md mx-auto" />

          <p className="max-w-xl mx-auto text-base sm:text-lg 2xl:text-xl text-ink-muted leading-relaxed">
            Speak for thirty seconds today. Your hardware key seals it. Solana settles it. The next
            doctor you see scans a QR and meets you with the full picture for the first time.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 sm:justify-center">
            <Link href="/onboarding" className="btn-accent w-full sm:w-auto">
              <span>◉ Begin Onboarding</span>
            </Link>
            <Link href="/app" className="btn-primary w-full sm:w-auto">
              <span>Open Patient App →</span>
            </Link>
            <Link href="/doctor" className="btn-secondary w-full sm:w-auto">
              <span>I&apos;m a Doctor</span>
            </Link>
          </div>

          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
            Devnet · open-source · MIT
          </p>
        </div>
      </div>
    </section>
  );
}
