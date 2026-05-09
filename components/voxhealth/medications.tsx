'use client';

import { VoiceOrb } from './voice-orb';

interface MedicationDose {
  id: string;
  name: string;
  dose: string;
  time: string;
  taken?: boolean;
}

const todaysMeds: MedicationDose[] = [
  { id: '1', name: 'Lisinopril', dose: '10 mg', time: '8:00 AM', taken: true },
  { id: '2', name: 'Metformin', dose: '500 mg', time: '12:00 PM', taken: false },
  { id: '3', name: 'Atorvastatin', dose: '20 mg', time: '8:00 PM', taken: false },
];

export function Medications() {
  const streakDays = 8;

  return (
    <div className="min-h-screen bg-paper">
      {/* Top navigation */}
      <nav className="sticky top-0 bg-paper border-b border-rule z-40">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="font-serif text-xl font-bold text-ink">VoxHealth</div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Streak counter - Display-L with progress bar */}
        <div className="mb-12">
          <h1 className="text-5xl font-serif font-bold text-ink mb-6">
            {streakDays} days on time
          </h1>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-linen rounded-full overflow-hidden">
            <div
              className="h-full bg-sage transition-all"
              style={{ width: `${(streakDays / 30) * 100}%` }}
            />
          </div>
        </div>

        {/* Medication cards in chronological order */}
        <div className="space-y-4 mb-16">
          {todaysMeds.map((med) => (
            <div
              key={med.id}
              className={`flex items-center gap-4 border rounded-[14px] p-6 transition-all ${
                med.taken
                  ? 'border-sage bg-sage-soft'
                  : 'border-rule bg-linen hover:bg-vellum'
              }`}
            >
              {/* Medication info */}
              <div className="flex-1">
                <h3 className="font-serif text-lg font-bold text-ink">
                  {med.name}
                </h3>
                <div className="flex items-baseline gap-4 mt-2">
                  <span className="font-mono text-base text-ink-muted">
                    {med.dose}
                  </span>
                  <span className="text-sm text-ink-subtle">{med.time}</span>
                </div>
              </div>

              {/* Check ring */}
              <button
                className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  med.taken
                    ? 'border-sage bg-sage'
                    : 'border-sage hover:bg-sage-soft'
                }`}
              >
                {med.taken && (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Add medication button - voice-first */}
        <button className="w-full h-14 border border-sage text-sage font-medium rounded-[12px] hover:bg-sage-soft transition-colors">
          + Add medication (voice or text)
        </button>
      </main>

      {/* Docked VoiceOrb */}
      <div className="fixed bottom-8 right-8 z-50">
        <VoiceOrb />
      </div>
    </div>
  );
}
