'use client';

import { useEffect, useState } from 'react';

/**
 * LI.FI cross-chain checkout.
 *
 * We embed LI.FI's hosted Jumper interface in an iframe rather than bundling
 * @lifi/widget directly. The widget package pulls in a megabyte+ of Sui
 * transitive dependencies for chains we don't care about, and ships with a
 * version pin to a removed @mysten/sui export.
 *
 * The hosted iframe gives us:
 *   - identical UX to the embedded widget
 *   - automatic version updates without bumping our package.json
 *   - zero JS weight on our bundle
 *   - chain coverage drops in/out without redeploying
 *
 * The lifi.quoteSubscription tool in lib/agent/tools/lifi.ts still talks to
 * the LI.FI HTTP API directly for programmatic flows (e.g. agentic
 * subscription auto-renewal).
 */

const JUMPER_URL = 'https://jumper.exchange/?fromChain=137&toChain=1151111081099710';

export function LifiWidgetMount({ patientPubkey }: { patientPubkey?: string }) {
  const [src, setSrc] = useState(JUMPER_URL);

  useEffect(() => {
    if (patientPubkey) {
      const url = new URL(JUMPER_URL);
      url.searchParams.set('toAddress', patientPubkey);
      setSrc(url.toString());
    }
  }, [patientPubkey]);

  return (
    <div className="relative w-full" style={{ minHeight: 720 }}>
      <iframe
        title="LI.FI cross-chain checkout"
        src={src}
        className="w-full h-[720px] border-0"
        loading="lazy"
        allow="clipboard-write; payment"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
        Powered by LI.FI · 60+ chains, 20+ bridges, settles to Solana USDC.
      </p>
    </div>
  );
}
