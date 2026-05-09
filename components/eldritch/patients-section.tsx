export function PatientsSection() {
  const cohorts = [
    {
      tag: 'Primary',
      headline: '133M',
      label: 'chronic-condition adults in the US',
      who: 'Margaret, 68. Diabetes + early arthritis.',
      story:
        '“The phone listens. I just tell it. My granddaughter set it up once and now I do it every morning before coffee.”',
    },
    {
      tag: 'Secondary',
      headline: '53M',
      label: 'family caregivers',
      who: 'James, 45. Manages his father&apos;s medication remotely.',
      story:
        '“If Dad misses a dose, I get a ping. If a symptom looks worse than last week, NoahAI flags it before the next visit.”',
    },
    {
      tag: 'Edge case',
      headline: '∞',
      label: 'emergency rooms',
      who: 'Sarah, 35. Severe headache, paramedics arrive.',
      story:
        '“Scan the QR on the lock screen. The full timeline appears for the next two hours. Then it&apos;s gone again.”',
    },
  ];

  return (
    <section id="patients" className="relative z-10 py-16 sm:py-20 md:py-28 2xl:py-36 border-t border-ink/10">
      <div className="section-shell">
        <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-end mb-10 md:mb-12 2xl:mb-16">
          <div className="md:col-span-7">
            <div className="glyph-badge mb-4">§ 05 — Who it serves</div>
            <h2 className="display-l">
              Three lives.
              <br />
              <span className="text-sage italic">One key.</span>
            </h2>
          </div>
          <p className="md:col-span-5 text-sm text-ink-muted leading-relaxed">
            VoxHealth was scoped against three concrete users — not a buyer persona. Every UX
            decision (voice-first, no typing, large tap targets, QR over login flows) traces back
            to one of them.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 2xl:gap-6">
          {cohorts.map((c) => (
            <article key={c.tag} className="ink-card p-6 sm:p-7 md:p-8 flex flex-col sm:last:col-span-2 lg:last:col-span-1">
              <span className="glyph-badge mb-5">{c.tag}</span>
              <p className="metric-number text-4xl sm:text-5xl md:text-6xl font-bold leading-none">
                {c.headline}
              </p>
              <p className="mt-3 text-xs font-mono uppercase tracking-[0.18em] text-ink-subtle">
                {c.label}
              </p>
              <div className="rune-rule my-5" />
              <p className="font-display font-semibold text-sm mb-3">{c.who}</p>
              <blockquote className="text-sm text-ink-muted italic leading-relaxed">
                {c.story}
              </blockquote>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
