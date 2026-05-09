'use client';

import { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useWallet } from '@/context/wallet-context';

export function QRShare() {
  const { publicKey, isConnected, connect } = useWallet();
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const doctorName = 'Dr. Sarah Chen';

  useEffect(() => {
    if (timeRemaining <= 0) return;
    const id = setInterval(() => setTimeRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [timeRemaining]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const grantUrl = useMemo(() => {
    if (!publicKey) return '';
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://vox-health.vercel.app';
    return `${origin}/doctor?patient=${encodeURIComponent(publicKey)}`;
  }, [publicKey]);

  return (
    <div className="min-h-screen bg-paper">
      {/* Top navigation */}
      <nav className="sticky top-0 bg-paper border-b border-rule z-40">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="font-serif text-xl font-bold text-ink">VoxHealth</div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Page title */}
        <h1 className="text-5xl font-serif font-bold text-ink mb-4">
          Share with your doctor
        </h1>

        {/* Explanation */}
        <p className="text-lg text-ink-muted mb-12">
          They&apos;ll see your timeline for the next 30 minutes.
        </p>

        {/* QR Code Share Panel - dignified, not a wallet popover */}
        <div className="max-w-sm mx-auto mb-12">
          <div className="border-4 border-linen rounded-lg p-6 bg-white">
            <div className="w-full aspect-square rounded flex items-center justify-center bg-white">
              {isConnected && grantUrl ? (
                <QRCodeSVG
                  value={grantUrl}
                  size={320}
                  level="M"
                  marginSize={0}
                  bgColor="#ffffff"
                  fgColor="#0B0E12"
                  className="w-full h-full"
                />
              ) : (
                <div className="text-center px-6">
                  <p className="text-sm text-ink-muted mb-4">
                    Connect your wallet to generate a sharing QR.
                  </p>
                  <button
                    type="button"
                    onClick={connect}
                    className="text-sm font-medium text-sage hover:underline"
                  >
                    Connect wallet
                  </button>
                </div>
              )}
            </div>
          </div>
          {isConnected && publicKey && (
            <p className="mt-4 font-mono text-xs text-ink-subtle break-all text-center">
              {publicKey}
            </p>
          )}
        </div>

        {/* Doctor details */}
        <div className="max-w-sm mx-auto mb-12 space-y-6">
          {/* Doctor name */}
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-ink-subtle mb-2">
              Sharing with
            </p>
            <p className="text-2xl font-serif font-bold text-ink">{doctorName}</p>
          </div>

          {/* Permission scope as plain sentences with toggles */}
          <div className="space-y-4 border-t border-rule pt-6">
            <p className="text-sm font-medium uppercase tracking-wider text-ink-subtle mb-4">
              Access permissions
            </p>

            {[
              { label: 'View timeline', enabled: true },
              { label: 'View medications', enabled: true },
              { label: 'View vital signs', enabled: true },
            ].map((perm, i) => (
              <label
                key={i}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={perm.enabled}
                  readOnly
                  className="w-5 h-5 rounded border-2 border-rule accent-sage"
                />
                <span className="text-base text-ink group-hover:text-sage transition-colors">
                  {perm.label}
                </span>
              </label>
            ))}
          </div>

          {/* Expiry timer */}
          <div className="border-t border-rule pt-6">
            <p className="text-sm font-medium uppercase tracking-wider text-ink-subtle mb-2">
              Expires in
            </p>
            <p className="text-3xl font-mono font-bold text-ink">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* Stop sharing button - coral text on linen, not coral fill */}
        <button className="w-full h-12 font-medium border border-coral text-coral hover:bg-coral-soft transition-colors rounded-[12px]">
          Stop sharing now
        </button>
      </main>
    </div>
  );
}
