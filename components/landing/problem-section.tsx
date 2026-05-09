'use client';

import { AlertCircle, TrendingDown } from 'lucide-react';

export function ProblemSection() {
  return (
    <section className="w-full bg-secondary text-secondary-foreground py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-16">
          The Problem With Current Medical Records
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-fr">
          {/* Large Quote Card */}
          <div className="md:col-span-1 md:row-span-2 bg-white/10 backdrop-blur rounded-2xl p-8 flex flex-col justify-between border border-white/20">
            <blockquote className="text-2xl md:text-3xl font-serif italic mb-6">
              &quot;I can&apos;t remember what I told my cardiologist last month&quot;
            </blockquote>
            <div>
              <p className="text-sm font-medium">Margaret, 68</p>
              <p className="text-xs text-secondary-foreground/70">Patient with heart condition</p>
            </div>
          </div>

          {/* Stat Card 1 */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-destructive/20 rounded-lg flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold mb-2">30%</p>
                <p className="text-sm">of medical errors stem from incomplete patient histories</p>
              </div>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent/20 rounded-lg flex-shrink-0">
                <TrendingDown className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold mb-2">$100B</p>
                <p className="text-sm">wasted annually on duplicate tests</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
