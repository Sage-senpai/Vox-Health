'use client';

import { Lock, Brain, Share2, Zap } from 'lucide-react';

export function EldritchFeatures() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Recording',
      description: 'Speak. Think. Heal. Your voice becomes data in milliseconds.',
      accent: true,
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Pattern recognition powered by neural networks and medical intelligence.',
      accent: false,
    },
    {
      icon: Lock,
      title: 'Hardware Encrypted',
      description: 'Your records live on your hardware wallet. Unhackable. Permanent.',
      accent: false,
    },
    {
      icon: Share2,
      title: 'Zero-Trust Sharing',
      description: 'Give doctors access. Revoke instantly. Complete control.',
      accent: false,
    },
  ];

  return (
    <section className="relative w-full bg-background py-32 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section title */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-serif font-black text-white mb-4 tracking-tight">
            Superpowers for Your Health
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
        </div>

        {/* Features grid - 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`group relative p-8 border transition-all ${
                  feature.accent
                    ? 'border-primary bg-primary/5 hover:bg-primary/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-none mb-6 flex items-center justify-center ${
                  feature.accent ? 'bg-primary text-white' : 'border border-white/30 text-white/80'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-serif font-bold text-white mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-white/60 leading-relaxed font-light">
                  {feature.description}
                </p>

                {/* Minimal accent line */}
                <div className={`absolute bottom-0 left-0 h-1 bg-primary transition-all group-hover:w-full ${
                  feature.accent ? 'w-full' : 'w-0'
                }`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
