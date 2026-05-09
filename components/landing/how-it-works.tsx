'use client';

import { CheckCircle2 } from 'lucide-react';

const steps = [
  {
    number: '1',
    title: 'Record Your Story',
    description: 'Hit the microphone button and describe how you&apos;re feeling. As simple as talking to a friend.',
  },
  {
    number: '2',
    title: 'AI Organizes Your Data',
    description: 'Your voice is transcribed and automatically organized with timestamps, symptoms, and severity levels.',
  },
  {
    number: '3',
    title: 'Share with Doctors',
    description: 'Generate a QR code to securely grant time-limited access to your medical history for your healthcare team.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-gradient-to-b from-white to-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Get started in minutes. No complicated setup required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Step Number Circle */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white">
                  <span className="text-2xl font-serif font-bold">{step.number}</span>
                </div>
              </div>

              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 right-0 w-full h-0.5 bg-border transform translate-x-1/2" />
              )}

              {/* Content */}
              <div className="space-y-3 text-center">
                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-secondary leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 p-8 bg-background rounded-lg border border-border">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">Everything is encrypted and private</h4>
              <p className="text-secondary">
                Your medical records are end-to-end encrypted. You control who sees what, and can revoke access anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
