export function TracksSection() {
  const tracks = [
    {
      sponsor: 'Solana',
      prize: '$10,000',
      title: 'Best App Overall',
      delivery: 'Anchor program (Rust) deployed to devnet, contract address in README, public repo, demo under 3 min.',
      tone: 'sage',
    },
    {
      sponsor: 'ElevenLabs',
      prize: '3 mo. Scale tier',
      title: 'Best Integration',
      delivery: 'Conversational agent + STT + TTS wired through the patient orb and the doctor briefing playback.',
      tone: 'sage',
    },
    {
      sponsor: 'Ledger',
      prize: 'Top 10 — 1 device / member',
      title: 'Hardware-encrypted UX',
      delivery: 'On-device Ed25519 sealing of every entry. Patient holds the seed; no cloud key escrow.',
      tone: 'indigo',
    },
    {
      sponsor: 'NoahAI',
      prize: '5M credits',
      title: 'Clinical reasoning',
      delivery: 'Symptom progression + drug-interaction layer reading the rolling 30-day transcript window.',
      tone: 'amber',
    },
    {
      sponsor: 'Virtuals',
      prize: '$500',
      title: 'AI agent → physical world',
      delivery: 'Caregiver agent that pages family, schedules pharmacy refills, and triggers home-care follow-ups.',
      tone: 'coral',
    },
    {
      sponsor: 'LI.FI',
      prize: '$1,000',
      title: 'Cross-chain UX',
      delivery: 'Embedded widget for cross-chain subscriptions + x402 micro-billing on each doctor read.',
      tone: 'sage',
    },
    {
      sponsor: 'Solana Mobile',
      prize: 'Seeker phones (1st/2nd/3rd)',
      title: 'Mobile-native record',
      delivery: 'Mobile Wallet Adapter signing, offline-first queue, dApp Store publish-ready build.',
      tone: 'amber',
    },
  ];

  return (
    <section id="tracks" className="relative z-10 py-20 md:py-28 border-t border-ink/10 bg-linen/40">
      <div className="section-shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <div className="glyph-badge glyph-badge-amber mb-4">§ 04 — Hackathon tracks</div>
            <h2 className="display-l">
              Submitted to <span className="text-sage italic">seven</span> tracks.
            </h2>
            <p className="mt-4 max-w-xl text-sm text-ink-muted leading-relaxed">
              Each integration is wired against a specific sponsor&apos;s qualification requirements
              — open repo, README with addresses, devnet deploy, demo under three minutes.
            </p>
          </div>
          <div className="metric-number text-right">
            <div className="text-5xl md:text-6xl font-bold leading-none">$12K+</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle mt-2">
              combined prize pool targeted
            </div>
          </div>
        </div>

        <div className="ink-panel p-2">
          <table className="w-full text-left">
            <thead>
              <tr className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
                <th className="py-4 px-5 font-semibold">Sponsor</th>
                <th className="py-4 px-5 font-semibold">Track</th>
                <th className="py-4 px-5 font-semibold hidden md:table-cell">VoxHealth delivery</th>
                <th className="py-4 px-5 font-semibold text-right">Prize</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((t) => (
                <tr key={t.sponsor} className="border-t border-ink/10 align-top">
                  <td className="py-5 px-5">
                    <div className="font-display font-bold text-base">{t.sponsor}</div>
                  </td>
                  <td className="py-5 px-5">
                    <div className="text-sm font-medium">{t.title}</div>
                    <div className="md:hidden mt-2 text-xs text-ink-muted leading-relaxed">
                      {t.delivery}
                    </div>
                  </td>
                  <td className="py-5 px-5 hidden md:table-cell text-sm text-ink-muted leading-relaxed">
                    {t.delivery}
                  </td>
                  <td className="py-5 px-5 text-right">
                    <span className="metric-number text-sm font-bold whitespace-nowrap">
                      {t.prize}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
