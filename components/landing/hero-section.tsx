'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-background to-white">
      <div className="max-w-2xl text-center space-y-8">
        {/* Logo/Branding */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-serif font-bold text-primary">VoxHealth</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground leading-tight">
            Your Voice, Your Health Story
          </h1>
          <p className="text-xl text-secondary leading-relaxed">
            Track your symptoms, medications, and health journey with voice-first journaling. 
            Securely share your medical history with doctors using Web3 technology.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link href="/onboarding">
            <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-lg h-12 px-8">
              Start Your Journey
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-12 px-8">
              Learn More
            </Button>
          </Link>
        </div>

        {/* Trust Badge */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">Trusted by healthcare professionals</p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <span className="text-xs text-muted-foreground">HIPAA Compliant</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">Web3 Secure</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">Privacy First</span>
          </div>
        </div>
      </div>
    </section>
  );
}
