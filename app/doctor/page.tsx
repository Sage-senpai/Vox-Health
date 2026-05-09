import { EldritchNav } from '@/components/eldritch/nav';
import { EldritchFooter } from '@/components/eldritch/footer';
import { DoctorPortal } from '@/components/doctor/doctor-portal';

export const metadata = {
  title: 'Doctor portal — VoxHealth',
  description:
    'Verify a patient access grant on Solana, read the encrypted timeline, and play an ElevenLabs spoken summary.',
};

export default function DoctorPortalPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="nascent-bg" aria-hidden />
      <EldritchNav />

      <main className="section-shell relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          <aside className="lg:col-span-5">
            <span className="glyph-badge mb-5">§ Doctor portal · Solana</span>
            <h1 className="display-l mb-6">
              Scan a QR.
              <br />
              <span className="text-sage italic">Read the timeline.</span>
            </h1>
            <div className="rune-rule my-7" />
            <p className="text-base text-ink-muted leading-relaxed">
              Every grant is a PDA on Solana, scoped to (patient, doctor) with a
              hard expiry. We read it, verify it, and only then surface the
              patient&apos;s timeline. ElevenLabs reads the past 30 days back to
              you in a clinical voice while you scan the chart.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-ink-muted">
              <Row label="Verification" value="On-chain (Solana program)" />
              <Row label="Granularity" value="View · Comment · Full" />
              <Row label="Default expiry" value="24h, patient-overridable" />
              <Row label="Audit" value="Every read indexed via program event" />
            </ul>
          </aside>

          <section className="lg:col-span-7">
            <DoctorPortal />
          </section>
        </div>
      </main>

      <EldritchFooter />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline justify-between border-b border-ink/10 pb-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-subtle">
        {label}
      </span>
      <span className="text-sm font-semibold text-ink">{value}</span>
    </li>
  );
}
