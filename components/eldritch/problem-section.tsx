import { CountUp } from './count-up';

export function ProblemSection() {
  return (
    <section id="problem" className="relative z-10 py-16 sm:py-20 md:py-28 2xl:py-36">
      <div className="section-shell">
        <div className="grid md:grid-cols-12 gap-8 md:gap-10 2xl:gap-16">
          <div className="md:col-span-5">
            <div className="glyph-badge mb-5">§ 01 — The break</div>
            <h2 className="display-l">
              The medical record
              <br />
              <span className="text-coral italic">is broken.</span>
            </h2>
            <div className="rune-rule my-8" />
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-md">
              Patients forget symptoms between visits. Records are siloed across hospitals. Elderly
              users can&apos;t use complex apps. And nobody actually owns their own history.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 2xl:gap-6">
            <Stat
              headline={<CountUp to={30} suffix="%" />}
              body="of medical errors trace back to incomplete patient histories."
              accent="coral"
            />
            <Stat
              headline={<CountUp to={133} suffix="M" />}
              body="adults in the US live with a chronic condition."
              accent="amber"
            />
            <Stat
              headline={<CountUp to={53} suffix="M" />}
              body="family caregivers manage another person's medications."
              accent="indigo"
            />
            <Stat
              headline={<CountUp to={100} prefix="$" suffix="B" />}
              body="lost yearly to duplicate testing across hospital silos."
              accent="sage"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  headline,
  body,
  accent,
}: {
  headline: React.ReactNode;
  body: string;
  accent: 'coral' | 'amber' | 'indigo' | 'sage';
}) {
  const cardClass = {
    coral: 'ink-card ink-card-coral',
    amber: 'ink-card ink-card-amber',
    indigo: 'ink-card ink-card-indigo',
    sage: 'ink-card ink-card-accent',
  }[accent];

  return (
    <article className={`${cardClass} p-6 md:p-7`}>
      <p className="metric-number text-4xl md:text-5xl font-bold text-ink leading-none">
        {headline}
      </p>
      <p className="mt-4 text-sm text-ink-muted leading-relaxed">{body}</p>
    </article>
  );
}
