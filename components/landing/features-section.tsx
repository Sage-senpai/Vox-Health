'use client';

import { Mic, Lock, Users, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'Voice-First Recording',
    description: 'Simply speak your symptoms, concerns, and health updates. Our AI transcribes and organizes everything.',
  },
  {
    icon: Lock,
    title: 'HIPAA Compliant & Encrypted',
    description: 'Your medical data is protected with enterprise-grade encryption and HIPAA compliance.',
  },
  {
    icon: Users,
    title: 'Secure Doctor Sharing',
    description: 'Grant time-limited access to doctors with QR codes. Share only what they need to see.',
  },
  {
    icon: TrendingUp,
    title: 'Health Insights',
    description: 'Track patterns in your symptoms and health over time with beautiful visualizations.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Why VoxHealth?
          </h2>
          <p className="text-lg text-ink-muted max-w-2xl mx-auto">
            Designed specifically for patients who want to take control of their health story.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex gap-6 p-6 rounded-lg border border-border bg-background/50 hover:border-primary/30 hover:bg-background transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-ink-muted leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
