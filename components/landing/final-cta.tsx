'use client';

import { Button } from '@/components/ui/button';

export function FinalCTA() {
  return (
    <section className="relative w-full bg-background py-32 border-t border-white/10 overflow-hidden">
      {/* Animated background accent */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
        {/* Headline */}
        <h2 className="text-5xl md:text-7xl font-serif font-black text-white mb-6 leading-tight tracking-tight">
          Your Voice Matters
        </h2>

        {/* Accent line */}
        <div className="w-20 h-1 bg-primary mx-auto mb-10" />

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto font-light">
          Join thousands of patients taking control of their health data. Free forever. Always.
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          className="h-12 px-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-none transition-all shadow-lg shadow-primary/30 hover:shadow-xl"
        >
          Start Recording Now
        </Button>

        {/* Fine print */}
        <p className="text-white/60 text-xs font-light mt-10 tracking-wide">
          HIPAA COMPLIANT • NO CREDIT CARD • YOUR DATA FOREVER
        </p>
      </div>
    </section>
  );
}
