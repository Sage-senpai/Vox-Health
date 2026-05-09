import Link from 'next/link';

export function EldritchFooter() {
  return (
    <footer className="relative z-10 bg-ink text-paper border-t border-ink">
      <div className="section-shell py-16 md:py-20">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="inline-block w-9 h-9 bg-paper text-ink grid place-items-center font-display font-bold text-base"
                style={{ clipPath: 'var(--vox-notch)' }}
              >
                V
              </span>
              <span className="font-display font-bold text-xl">VoxHealth</span>
            </div>
            <p className="text-sm text-paper/70 max-w-md leading-relaxed">
              Voice-first medical record. Encrypted on a Ledger. Settled on Solana. Read by the
              doctors you choose, only when you choose.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="glyph-badge glyph-badge-ink border-paper/20 text-paper">MIT · open-source</span>
              <span className="glyph-badge glyph-badge-ink border-paper/20 text-paper">Devnet · 2026</span>
            </div>
          </div>

          <FooterCol
            title="Product"
            links={[
              { label: 'Patient app', href: '/app' },
              { label: 'Doctor portal', href: '/doctor' },
              { label: 'Onboarding', href: '/onboarding' },
              { label: 'Dashboard', href: '/dashboard' },
            ]}
          />
          <FooterCol
            title="Stack"
            links={[
              { label: 'Solana', href: 'https://solana.com', external: true },
              { label: 'ElevenLabs', href: 'https://elevenlabs.io', external: true },
              { label: 'NoahAI', href: 'https://trynoah.ai', external: true },
              { label: 'Ledger', href: 'https://ledger.com', external: true },
              { label: 'Virtuals', href: 'https://virtuals.io', external: true },
              { label: 'LI.FI', href: 'https://li.fi', external: true },
              { label: 'Solana Mobile', href: 'https://solanamobile.com', external: true },
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              { label: 'Privacy', href: '#' },
              { label: 'Terms', href: '#' },
              { label: 'HIPAA posture', href: '#' },
              { label: 'Security', href: '#' },
            ]}
          />
        </div>

        <div className="rune-rule mt-12 mb-6 opacity-50" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">
          <span>© 2026 VoxHealth · Built for the Solana hackathon</span>
          <span>◆ Speak it · Seal it · Own it</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div className="md:col-span-2">
      <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 mb-5">
        {title}
      </h4>
      <ul className="space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            {l.external ? (
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="text-paper/80 hover:text-sage transition-colors"
              >
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="text-paper/80 hover:text-sage transition-colors">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
