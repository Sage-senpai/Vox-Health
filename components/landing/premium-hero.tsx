'use client';

import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';

export function PremiumHero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Animated violet glow background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-full h-full bg-gradient-to-br from-background via-background to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl animate-pulse" />
      </div>

      {/* Minimal geometric accent lines */}
      <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-12 text-center">
        {/* Minimal tagline */}
        <div className="mb-12 tracking-[0.3em] text-primary font-light text-xs uppercase opacity-80">
          Biomedical Voice Intelligence
        </div>

        {/* Main headline - large and striking */}
        <h1 className="text-6xl md:text-8xl font-serif font-black text-white mb-6 leading-[1.1] tracking-tight">
          VoxHealth
        </h1>

        {/* Underline accent */}
        <div className="w-20 h-1 bg-primary mx-auto mb-10" />

        {/* Secondary headline */}
        <h2 className="text-2xl md:text-3xl font-light text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto font-serif">
          Your voice becomes your medical record
        </h2>

        {/* Description - minimal and elegant */}
        <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto mb-12 leading-relaxed font-light">
          AI-powered health journaling encrypted at the hardware level. Share with doctors. Own your data forever.
        </p>

        {/* CTA Buttons - minimal and clean */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Button
            size="lg"
            className="h-12 px-10 bg-primary hover:bg-primary/90 text-white font-medium rounded-none transition-all hover:shadow-lg hover:shadow-primary/50"
          >
            <Mic className="w-5 h-5 mr-2" />
            Start Recording
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-10 border border-white/30 text-white hover:border-white/60 hover:bg-white/5 font-medium rounded-none transition-all"
          >
            View Demo
          </Button>
        </div>

        {/* Minimal status indicator */}
        <div className="inline-flex items-center gap-3 text-white/60 text-sm">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>HIPAA Compliant • Web3 Secured</span>
        </div>
      </div>

      {/* Bottom info bar - eldritch status */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </section>
  );
}
