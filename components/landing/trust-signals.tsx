'use client';

import { Shield, Check, TrendingUp } from 'lucide-react';

export function TrustSignals() {
  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground tracking-widest uppercase font-medium mb-12">
          Trusted by patients who care about their health data
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {/* HIPAA Compliant */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Shield className="w-6 h-6 text-ink-muted" />
            </div>
            <p className="text-xs font-semibold text-ink-muted text-center">HIPAA Compliant</p>
          </div>

          {/* Encrypted on Solana */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Check className="w-6 h-6 text-primary" />
            </div>
            <p className="text-xs font-semibold text-primary text-center">Encrypted on Solana</p>
          </div>

          {/* 99.9% Uptime */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-accent/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <p className="text-xs font-semibold text-accent text-center">99.9% Uptime</p>
          </div>

          {/* Open Source */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-destructive/10 rounded-lg">
              <Check className="w-6 h-6 text-destructive" />
            </div>
            <p className="text-xs font-semibold text-destructive text-center">Open Source</p>
          </div>
        </div>
      </div>
    </section>
  );
}
