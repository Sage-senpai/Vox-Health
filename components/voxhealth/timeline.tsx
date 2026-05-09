'use client';

import { VoiceOrb } from './voice-orb';

interface TimelineEntryData {
  id: string;
  date: Date;
  title: string;
  summary: string;
  tags: Array<'Medication' | 'Symptom' | 'Vitals'>;
  isVerified?: boolean;
}

const mockEntries: TimelineEntryData[] = [
  {
    id: '1',
    date: new Date(2026, 4, 8), // May 8, 2026
    title: 'Shoulder pain after gardening',
    summary: 'Mild discomfort in left shoulder',
    tags: ['Symptom'],
    isVerified: true,
  },
  {
    id: '2',
    date: new Date(2026, 4, 8),
    title: 'Morning medication',
    summary: 'Took all scheduled doses',
    tags: ['Medication'],
    isVerified: true,
  },
  {
    id: '3',
    date: new Date(2026, 4, 7),
    title: 'Blood pressure check',
    summary: '138 / 88 mmHg',
    tags: ['Vitals'],
    isVerified: true,
  },
];

export function Timeline() {
  // Group entries by day
  const entriesByDay = mockEntries.reduce((acc, entry) => {
    const dayKey = entry.date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    if (!acc[dayKey]) {
      acc[dayKey] = [];
    }
    acc[dayKey].push(entry);
    return acc;
  }, {} as Record<string, TimelineEntryData[]>);

  return (
    <div className="min-h-screen bg-paper">
      {/* Top navigation */}
      <nav className="sticky top-0 bg-paper border-b border-rule z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="font-serif text-xl font-bold text-ink">VoxHealth</div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Page title */}
        <h1 className="text-5xl font-serif font-bold text-ink mb-2">Your timeline</h1>
        <p className="text-base text-ink-muted mb-8">All entries since you started.</p>

        {/* Filter pills */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-2">
          {['All', 'Symptoms', 'Medications', 'Visits'].map((filter) => (
            <button
              key={filter}
              className="px-4 py-2 rounded-full border border-rule bg-linen text-ink text-sm font-medium hover:bg-vellum transition-colors whitespace-nowrap"
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Timeline entries */}
        <div className="space-y-12">
          {Object.entries(entriesByDay).map(([dayKey, entries], dayIndex) => (
            <div key={dayKey} className="relative">
              {/* Sticky month divider */}
              <div className="sticky top-16 bg-paper py-3 border-b border-rule mb-8 flex items-baseline gap-4">
                <h2 className="font-serif text-lg font-bold text-ink">{dayKey}</h2>
                <p className="text-sm text-ink-subtle">
                  {entries[0].date.toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
              </div>

              {/* Entries for the day - stagger fade-up animation */}
              <div className="space-y-6">
                {entries.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="flex gap-6 animate-in fade-in slide-in-from-bottom-2"
                    style={{
                      animationDelay: `${idx * 40}ms`,
                    }}
                  >
                    {/* Left column - date (sticky on scroll) */}
                    <div className="flex-shrink-0 w-16 text-right sticky left-0">
                      <div className="font-mono text-sm font-bold text-ink-muted">
                        {dayKey.split(' ')[0].toUpperCase()}
                      </div>
                      <div className="text-xs text-ink-subtle">
                        {entries[0].date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                    </div>

                    {/* Right column - card */}
                    <div className="flex-1 border border-rule rounded-[14px] bg-linen p-6 hover:shadow-sm transition-shadow">
                      {/* Title */}
                      <h3 className="font-serif text-lg font-bold text-ink mb-2">
                        {entry.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-base text-ink-muted mb-4">{entry.summary}</p>

                      {/* Voice playback bar placeholder */}
                      <div className="bg-vellum rounded h-4 mb-4" />

                      {/* Tag chips */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-sage-soft text-sage"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Verified badge */}
                      {entry.isVerified && (
                        <div className="flex items-center gap-2 text-xs font-medium text-indigo">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo" />
                          Verified on chain
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Docked VoiceOrb at bottom */}
      <div className="fixed bottom-8 right-8 z-50">
        <VoiceOrb />
      </div>
    </div>
  );
}
