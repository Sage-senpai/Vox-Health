'use client';

import { useState } from 'react';

export function QRShare() {
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const doctorName = 'Dr. Sarah Chen';

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

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
            {/* QR Code placeholder - 360px square max per spec */}
            <div className="w-full aspect-square bg-vellum rounded flex items-center justify-center text-sm text-ink-subtle">
              QR Code
            </div>
          </div>
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
