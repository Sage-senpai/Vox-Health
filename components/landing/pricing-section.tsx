'use client';

import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export function PricingSection() {
  return (
    <section className="w-full bg-background py-32 border-t border-white/10">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-serif font-black text-white mb-4 tracking-tight">
            Transparent Pricing
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6" />
          <p className="text-white/70 font-light">No lockdown. No surprises. Cancel anytime.</p>
        </div>

        {/* Two pricing cards - minimal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="border border-white/10 bg-white/5 p-10 hover:bg-white/10 transition-all">
            <div className="mb-8">
              <p className="text-xs font-light text-white/60 uppercase tracking-widest mb-4">Starter</p>
              <p className="text-5xl font-serif font-bold text-white mb-1">Free</p>
              <p className="text-white/60 font-light text-sm">/forever</p>
            </div>

            <p className="text-white/90 mb-10 font-light">Everything you need to start</p>

            <div className="space-y-3 mb-10">
              {[
                'Unlimited voice entries',
                'AI analysis & patterns',
                'Share with 2 doctors',
                'Basic timeline tracking',
                'Mobile & web access',
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                  <span className="text-white/70 font-light text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full h-11 border border-white/20 text-white hover:border-white/60 hover:bg-white/5 font-medium rounded-none transition-all"
            >
              Get Started
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="border border-primary bg-primary/10 p-10 hover:bg-primary/15 transition-all relative group">
            <div className="absolute top-4 right-4 bg-primary text-white text-xs font-black px-3 py-1 rounded-none">
              RECOMMENDED
            </div>

            <div className="mb-8">
              <p className="text-xs font-light text-white/80 uppercase tracking-widest mb-4">Professional</p>
              <p className="text-5xl font-serif font-bold text-white mb-1">$9</p>
              <p className="text-white/60 font-light text-sm">/month, billed monthly</p>
            </div>

            <p className="text-white/90 mb-10 font-light">For serious health tracking</p>

            <div className="space-y-3 mb-10">
              <p className="text-xs text-white/60 font-light">Everything in Free, plus:</p>
              {[
                'Unlimited doctor access',
                'Family caregiver sharing',
                'Advanced health analytics',
                'Export medical reports (PDF)',
                'Priority support',
                '50GB encrypted storage',
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                  <span className="text-white/80 font-light text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold rounded-none transition-all shadow-lg shadow-primary/20"
            >
              Start Free Trial
            </Button>

            <p className="text-center text-xs text-white/60 font-light mt-4">
              14 days free. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
