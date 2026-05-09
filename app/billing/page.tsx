import { EldritchNav } from '@/components/eldritch/nav';
import { EldritchFooter } from '@/components/eldritch/footer';
import { LifiWidgetMount } from '@/components/billing/lifi-widget-mount';

export const metadata = {
  title: 'Billing — VoxHealth',
  description: 'Pay for VoxHealth Pro from any chain. Settle on Solana via LI.FI.',
};

export default function BillingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="nascent-bg" aria-hidden />
      <EldritchNav />

      <main className="section-shell relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5">
            <span className="glyph-badge mb-5">§ Billing · LI.FI</span>
            <h1 className="display-l mb-6">
              Pay from any chain.
              <br />
              <span className="text-sage italic">Settle on Solana.</span>
            </h1>
            <div className="rune-rule my-7" />
            <p className="text-base text-ink-muted leading-relaxed">
              VoxHealth Pro is $9/month — voice AI, doctor sharing, and family caregiver access.
              Pay in any token on any chain LI.FI supports. The widget bridges, swaps, and lands
              the funds as USDC on Solana automatically.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-ink-muted">
              <Row label="Origin chains" value="60+" />
              <Row label="Bridges aggregated" value="20+" />
              <Row label="Settles to" value="Solana mainnet · USDC" />
              <Row label="Doctor reads" value="x402 micro-billing · ¢ per read" />
            </ul>

            <div className="mt-10 rounded-none border border-ink/20 bg-linen/60 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle mb-2">
                Why cross-chain
              </p>
              <p className="text-sm text-ink-muted leading-relaxed">
                Most patients hold value somewhere — Polygon, Base, Arbitrum, Ethereum mainnet.
                Forcing them to bridge manually before subscribing turns a one-tap payment into a
                week-long onboarding. LI.FI removes that step entirely.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="ink-panel p-6 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle mb-5">
                Cross-chain checkout
              </p>
              <LifiWidgetMount />
            </div>
          </div>
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
