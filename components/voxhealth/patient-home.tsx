'use client';

import { VoiceOrb } from './voice-orb';
import { TrustStrip } from './trust-strip';

export function PatientHome() {
  const userName = 'Margaret';

  return (
    <div className="min-h-screen bg-paper">
      {/* Top navigation */}
      <nav className="sticky top-0 bg-paper border-b border-rule z-40">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* VoxHealth wordmark */}
          <div className="font-serif text-xl font-bold text-ink">VoxHealth</div>
          {/* Avatar placeholder */}
          <div className="w-10 h-10 rounded-full bg-linen border border-rule" />
        </div>
      </nav>

      {/* Main content - max-width 480px for patient flows */}
      <main className="max-w-xl mx-auto px-6 py-12 md:py-16">
        {/* Greeting - Display-M serif */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink mb-4 leading-tight">
          Good morning, {userName}.
        </h1>

        {/* Subtitle - Body-L */}
        <p className="text-lg md:text-xl font-normal text-ink-muted mb-16 leading-relaxed">
          How are you feeling today?
        </p>

        {/* Voice Orb */}
        <div className="flex justify-center mb-20">
          <VoiceOrb />
        </div>

        {/* Secondary tiles - low density */}
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          {/* Today's medications */}
          <div className="border border-rule rounded-[14px] bg-linen p-6 md:p-8">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-xl font-serif font-bold text-ink">Today&apos;s medications</h2>
              <span className="text-sm font-medium text-ink-subtle">3 doses</span>
            </div>
            <div className="space-y-3">
              {['8:00 AM', '2:00 PM', '8:00 PM'].map((time) => (
                <div key={time} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink-muted">{time}</span>
                  <div className="w-5 h-5 rounded-full border-2 border-sage hover:bg-sage-soft transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Last entry */}
          <div className="border border-rule rounded-[14px] bg-linen p-6 md:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-subtle mb-2">
              Last entry
            </h3>
            <p className="text-lg font-medium text-ink">8 hours ago</p>
            <p className="text-sm text-ink-muted mt-2">Mild shoulder pain after gardening</p>
          </div>
        </div>
      </main>

      {/* Trust strip footer */}
      <TrustStrip />
    </div>
  );
}
