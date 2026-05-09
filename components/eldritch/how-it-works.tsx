export function HowItWorks() {
  const steps = [
    {
      n: '01',
      kicker: 'Patient · 30s',
      title: 'Speak.',
      body:
        'Tap the orb. Talk for thirty seconds. ElevenLabs transcribes in 70+ languages. NoahAI asks the right follow-ups based on what you just said.',
      glyph: '◉',
    },
    {
      n: '02',
      kicker: 'Ledger · on-device',
      title: 'Seal.',
      body:
        'Audio + transcript are encrypted by your Ledger hardware wallet. The plaintext never leaves your phone. Only your hardware key can open it again.',
      glyph: '⌬',
    },
    {
      n: '03',
      kicker: 'Solana · ~1s',
      title: 'Settle.',
      body:
        'A pointer + access policy is written to a Solana program. Your timeline becomes immutable, append-only, and provably yours — not the hospital&apos;s.',
      glyph: '◇',
    },
    {
      n: '04',
      kicker: 'Doctor · QR scan',
      title: 'Share.',
      body:
        'Generate a one-time QR. The provider scans it, gets read access for the window you choose, then access expires automatically. No EMR migration. No begging.',
      glyph: '⬡',
    },
  ];

  return (
    <section id="how" className="relative z-10 py-20 md:py-28 border-t border-ink/10 bg-paper">
      <div className="section-shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <div className="glyph-badge mb-4">§ 02 — Ritual</div>
            <h2 className="display-l">
              Four moves.
              <br />
              <span className="text-sage italic">One record.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-ink-muted leading-relaxed">
            Voice in. Hardware-sealed. Chain-settled. Doctor-portable. The whole loop runs in under
            two seconds; the patient never sees the cryptography.
          </p>
        </div>

        <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => (
            <li key={step.n} className="ink-card p-7 flex flex-col">
              <div className="flex items-baseline justify-between mb-5">
                <span className="metric-number text-sm text-ink-subtle">{step.n}</span>
                <span aria-hidden className="text-2xl text-sage">{step.glyph}</span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle mb-3">
                {step.kicker}
              </p>
              <h3 className="font-display font-bold text-3xl mb-3">{step.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
