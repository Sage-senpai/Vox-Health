'use client';

import { Shield, Lock, Github } from 'lucide-react';

export function SecurityBadges() {
  return (
    <section className="w-full bg-secondary py-12 md:py-16">
      <div className="container mx-auto px-4">
        <p className="text-center text-secondary-foreground/80 text-sm mb-8 font-medium">
          Bank-level security, but you hold the keys
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {/* HIPAA Compliant */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur">
              <Shield className="w-8 h-8 text-secondary-foreground" />
            </div>
            <p className="text-sm font-semibold text-secondary-foreground text-center">HIPAA Compliant</p>
          </div>

          {/* SOC 2 Type II */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur">
              <Lock className="w-8 h-8 text-secondary-foreground" />
            </div>
            <p className="text-sm font-semibold text-secondary-foreground text-center">SOC 2 Type II</p>
          </div>

          {/* Encrypted on Solana */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur">
              <Shield className="w-8 h-8 text-secondary-foreground" />
            </div>
            <p className="text-sm font-semibold text-secondary-foreground text-center">Encrypted on Solana</p>
          </div>

          {/* Open Source */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur">
              <Github className="w-8 h-8 text-secondary-foreground" />
            </div>
            <p className="text-sm font-semibold text-secondary-foreground text-center">Open Source Code</p>
          </div>
        </div>
      </div>
    </section>
  );
}
