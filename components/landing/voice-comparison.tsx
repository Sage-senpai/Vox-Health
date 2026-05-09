'use client';

import { Play } from 'lucide-react';

export function VoiceComparison() {
  return (
    <section className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-6 text-foreground">
          Hear the Difference
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Voice captures what text can&apos;t—urgency, pain, emotion
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Text Entry Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">What Other Apps Record</h3>
            <div className="bg-secondary/5 rounded-xl border border-secondary/20 p-8">
              <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                "Headache. 7/10 severity. Started this morning."
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Clinical, incomplete, missing context
            </p>
          </div>

          {/* Voice Entry Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">What VoxHealth Preserves</h3>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/30 p-8">
              {/* Waveform */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-primary/20">
                <button className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                  <Play className="w-4 h-4 fill-current" />
                </button>
                <div className="flex-1 flex items-center gap-1 mx-4 h-12">
                  <div className="w-0.5 h-3 bg-primary rounded-sm" />
                  <div className="w-0.5 h-5 bg-primary rounded-sm" />
                  <div className="w-0.5 h-4 bg-primary rounded-sm" />
                  <div className="w-0.5 h-7 bg-primary rounded-sm" />
                  <div className="w-0.5 h-6 bg-primary rounded-sm" />
                  <div className="w-0.5 h-4 bg-primary rounded-sm" />
                  <div className="w-0.5 h-8 bg-primary rounded-sm" />
                </div>
                <span className="text-xs text-primary font-mono">1:24</span>
              </div>

              {/* Transcript with emotion tags */}
              <div className="space-y-2 text-sm">
                <p className="text-foreground">
                  My head is{' '}
                  <span className="px-2 py-1 bg-destructive/20 rounded text-destructive font-medium text-xs">
                    [pounding]
                  </span>{' '}
                  really badly{' '}
                  <span className="px-2 py-1 bg-destructive/20 rounded text-destructive font-medium text-xs">
                    [voice strain]
                  </span>
                  , started around 8am{' '}
                  <span className="px-2 py-1 bg-primary/20 rounded text-primary font-medium text-xs">
                    [urgency detected]
                  </span>
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Complete context, emotion, urgency—ready to share
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
