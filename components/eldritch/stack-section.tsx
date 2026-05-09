export function StackSection() {
  const stack = [
    {
      name: 'Solana',
      role: 'Settlement layer',
      tag: 'Best App Overall · $10K',
      body: 'Anchor program holds an append-only timeline of encrypted entry pointers + access grants. Sub-second confirmation. No EMR can rewrite your past.',
      bullets: ['Anchor program (Rust)', 'Devnet · contract addr in README', 'SPL token gating for Pro tier'],
      glyph: '◆',
      accent: 'sage',
    },
    {
      name: 'ElevenLabs',
      role: 'Voice intelligence',
      tag: 'Best Integration · Scale tier',
      body: 'Conversational agent transcribes the patient, asks empathic follow-ups, generates the doctor-summary playback in 70+ languages with low-latency TTS.',
      bullets: ['Agents API for follow-ups', 'STT for symptom logs', 'TTS for medication reminders'],
      glyph: '◉',
      accent: 'sage',
    },
    {
      name: 'NoahAI',
      role: 'Clinical reasoning',
      tag: '5M credits · pattern recognition',
      body: 'Reads the rolling 30-day transcript window. Flags symptom progression, medication interactions, and urgency before the next appointment.',
      bullets: ['Symptom pattern model', 'Drug-interaction checks', 'Severity auto-scoring'],
      glyph: '⌬',
      accent: 'amber',
    },
    {
      name: 'Ledger',
      role: 'Hardware encryption',
      tag: 'Top 10 prize · 1 device per teammate',
      body: 'Every entry is sealed with a key that never leaves the hardware wallet. HIPAA-aligned by construction — no provider, no cloud, no insurer holds the key.',
      bullets: ['Ed25519 signing on-device', 'Patient-held seed', 'Cold-storage of medical history'],
      glyph: '⬡',
      accent: 'indigo',
    },
    {
      name: 'Virtuals',
      role: 'Agent → physical world',
      tag: 'Best AI Agent into Physical · $500',
      body: 'A caregiver agent physically pages the family and the local pharmacy when adherence drops or a flagged symptom appears — voice in, real-world action out.',
      bullets: ['ROS 2-aware agent loop', 'Pharmacy refill triggers', 'Care-team paging'],
      glyph: '◇',
      accent: 'coral',
    },
    {
      name: 'LI.FI',
      role: 'Cross-chain payments',
      tag: 'Best Cross-Chain UX · $1K',
      body: 'Patients pay subscriptions and insurance copays from any chain. The LI.FI widget bridges to Solana so the user never sees a chain switch.',
      bullets: ['Embedded LI.FI widget', '60+ chains → Solana', 'x402 micro-billing for doctor reads'],
      glyph: '◈',
      accent: 'sage',
    },
    {
      name: 'Solana Mobile',
      role: 'Offline-first surface',
      tag: 'Best Mobile · Seeker phones',
      body: 'Mobile Wallet Adapter signs entries even with spotty rural connectivity. Entries queue locally, then settle to Solana when bandwidth returns.',
      bullets: ['MWA for entry signing', 'Offline queue + sync', 'dApp Store-ready build'],
      glyph: '▲',
      accent: 'amber',
    },
  ];

  return (
    <section id="stack" className="relative z-10 py-16 sm:py-20 md:py-28 2xl:py-36 border-t border-ink/10">
      <div className="section-shell">
        <div className="flex flex-col lg:flex-row lg:flex-wrap lg:items-end lg:justify-between gap-6 mb-10 md:mb-14 2xl:mb-16">
          <div>
            <div className="glyph-badge glyph-badge-ink mb-4">§ 03 — The stack</div>
            <h2 className="display-l">
              Seven systems.
              <br />
              <span className="text-sage italic">One ritual.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-ink-muted leading-relaxed">
            VoxHealth is not glued together. Every sponsor here owns a load-bearing layer of the
            patient → ledger → chain → doctor pipeline.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 2xl:gap-6">
          {stack.map((s) => (
            <StackCard key={s.name} {...s} />
          ))}

          {/* Joinder card — vendor agnostic */}
          <article className="ink-card-dark p-6 sm:p-7 md:p-8 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/60 mb-3">
                + your contribution
              </div>
              <h3 className="font-display font-bold text-2xl mb-3 text-paper">
                Add the eighth pillar.
              </h3>
              <p className="text-sm text-paper/70 leading-relaxed">
                Open issues for: Phantom mobile deep-link, ZK proof of doctor identity, FHIR
                export, multilingual Margaret-mode for non-English elderly users.
              </p>
            </div>
            <a
              href="https://github.com/Sage-senpai/Vox-health"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-sage hover:text-paper transition-colors"
            >
              → contribute on github
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}

function StackCard({
  name,
  role,
  tag,
  body,
  bullets,
  glyph,
  accent,
}: {
  name: string;
  role: string;
  tag: string;
  body: string;
  bullets: string[];
  glyph: string;
  accent: 'sage' | 'amber' | 'coral' | 'indigo';
}) {
  const cardClass = {
    sage: 'ink-card ink-card-accent',
    amber: 'ink-card ink-card-amber',
    coral: 'ink-card ink-card-coral',
    indigo: 'ink-card ink-card-indigo',
  }[accent];

  const glyphColor = {
    sage: 'text-sage',
    amber: 'text-amber',
    coral: 'text-coral',
    indigo: 'text-indigo',
  }[accent];

  return (
    <article className={`${cardClass} p-6 sm:p-7 md:p-8 flex flex-col`}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle mb-2">
            {role}
          </p>
          <h3 className="font-display font-bold text-2xl">{name}</h3>
        </div>
        <span aria-hidden className={`${glyphColor} text-3xl leading-none`}>{glyph}</span>
      </div>

      <p className="text-sm text-ink-muted leading-relaxed">{body}</p>

      <ul className="mt-5 space-y-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-xs font-mono text-ink-subtle">
            <span aria-hidden className="text-sage mt-px">▸</span>
            <span className="uppercase tracking-[0.08em]">{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-5 border-t border-ink/10">
        <span className="glyph-badge glyph-badge-ink text-[10px]">{tag}</span>
      </div>
    </article>
  );
}
