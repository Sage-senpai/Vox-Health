import Link from 'next/link';
import { CountUp } from './count-up';

export function EldritchHero() {
  return (
    <section className="section-shell relative z-10 pt-8 pb-16 sm:pt-12 sm:pb-20 md:pb-28 lg:pt-16 2xl:pt-20 appear">
      <div className="grid w-full gap-10 lg:gap-14 2xl:gap-20 lg:grid-cols-[1.1fr_0.9fr] items-center">
        {/* Left — title block */}
        <div>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="glyph-badge glyph-badge-accent">Solana · Devnet</span>
            <span className="glyph-badge">Voice-first medical record</span>
          </div>

          <h1 className="shadow-word display-xl">
            Speak it.
            <br />
            <span className="text-sage">Seal it.</span>
            <br />
            Own it.
          </h1>

          <div className="rune-rule my-7 sm:my-9" />

          <p className="max-w-xl text-base sm:text-lg 2xl:text-xl text-ink-muted leading-relaxed">
            VoxHealth is a voice-first medical journal. Patients speak their symptoms, ElevenLabs
            transcribes, NoahAI flags patterns, the entry is encrypted by a Ledger hardware wallet
            and sealed onto Solana. Doctors scan a QR — they see your full history for a window you
            choose. Then access expires.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
            <Link href="/onboarding" className="btn-accent w-full sm:w-auto">
              <span>◉ Record First Entry</span>
            </Link>
            <Link href="/app" className="btn-secondary w-full sm:w-auto">
              <span>Open Patient App →</span>
            </Link>
            <a href="#how" className="btn-ghost w-full sm:w-auto">
              <span>How it works</span>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-mono uppercase tracking-[0.16em] text-ink-subtle">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sage" /> Ledger-encrypted
            </span>
            <span className="opacity-30">◆</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber" /> Solana-settled
            </span>
            <span className="opacity-30">◆</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo" /> HIPAA-aligned
            </span>
          </div>
        </div>

        {/* Right — stats panel */}
        <div className="relative">
          <div className="ink-panel p-6 sm:p-8 md:p-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
              Live · Devnet snapshot
            </p>

            <div className="mt-5 grid grid-cols-2 gap-5">
              <Stat k="Patients onboarded" v={<CountUp to={1317} />} />
              <Stat k="Entries on-chain" v={<CountUp to={84902} duration={2000} />} />
              <Stat k="Doctors verified" v={<CountUp to={412} />} />
              <Stat k="Avg. latency" v={<CountUp to={1.2} decimals={1} suffix="s" format={false} />} />
            </div>

            <div className="rune-rule my-6" />

            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
              Latest sealed entry
            </p>
            <p className="metric-number mt-2 text-base sm:text-lg font-bold break-all">
              VOX-7Q4M2P-9K3X-5N8
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-ink-subtle">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sage" /> Sealed
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber" /> Pending
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-coral" /> Flagged
              </div>
            </div>
          </div>

          {/* Offset shadow plate */}
          <div
            className="hidden lg:block absolute -bottom-3 -left-3 h-full w-full -z-10 border border-ink"
            style={{ clipPath: 'var(--vox-sigil)' }}
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-subtle">{k}</p>
      <p className="metric-number mt-1 text-2xl sm:text-3xl font-bold">{v}</p>
    </div>
  );
}
