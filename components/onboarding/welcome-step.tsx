'use client';

import { Button } from '@/components/ui/button';
import { Mic, Heart, Lock } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="space-y-8">
      {/* Main Content */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Mic className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-serif font-bold text-foreground">
          Welcome to VoxHealth
        </h1>

        <p className="text-lg text-secondary leading-relaxed max-w-xl mx-auto">
          We&apos;re excited to help you take control of your health journey. 
          In just 4 simple steps, you&apos;ll be ready to start recording your symptoms and tracking your health.
        </p>
      </div>

      {/* Features Highlight */}
      <div className="grid gap-4">
        <div className="flex gap-4 p-4 rounded-lg bg-background border border-border">
          <Mic className="w-6 h-6 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground">Voice-First</h3>
            <p className="text-sm text-secondary">Simply speak your symptoms</p>
          </div>
        </div>

        <div className="flex gap-4 p-4 rounded-lg bg-background border border-border">
          <Heart className="w-6 h-6 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground">Track Everything</h3>
            <p className="text-sm text-secondary">Medications, symptoms, and health patterns</p>
          </div>
        </div>

        <div className="flex gap-4 p-4 rounded-lg bg-background border border-border">
          <Lock className="w-6 h-6 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground">Stay Private</h3>
            <p className="text-sm text-secondary">Your data is encrypted and HIPAA compliant</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Button
        onClick={onNext}
        size="lg"
        className="w-full bg-primary hover:bg-primary/90 text-white text-base h-12"
      >
        Let&apos;s Get Started
      </Button>
    </div>
  );
}
