export function SponsorStrip() {
  const sponsors = [
    'Solana',
    'ElevenLabs',
    'Ledger',
    'NoahAI',
    'Virtuals',
    'LI.FI',
    'Solana Mobile',
  ];
  // Duplicate for seamless loop
  const items = [...sponsors, ...sponsors];

  return (
    <section
      aria-label="Sponsors"
      className="border-y border-ink/10 bg-paper py-6 relative z-10"
    >
      <div className="section-shell flex items-center gap-6">
        <span className="hidden md:inline-flex glyph-badge glyph-badge-ink whitespace-nowrap">
          Built with
        </span>
        <div className="marquee flex-1">
          <div className="marquee-track">
            {items.map((s, i) => (
              <div
                key={`${s}-${i}`}
                className="flex items-center gap-3 font-display font-bold text-xl md:text-2xl text-ink/80 hover:text-sage transition-colors"
              >
                <span aria-hidden className="text-sage text-base">◆</span>
                <span className="whitespace-nowrap">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
