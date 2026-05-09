'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Wallet } from 'lucide-react';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 10);
    });
  }

  return (
    <>
      {/* Top Info Bar */}
      <div className="hidden md:block bg-secondary text-primary-foreground text-sm px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>24/7 Support: (888) 444-5555</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-primary-foreground/20 rounded text-xs font-semibold">
              HIPAA Compliant
            </span>
            <div className="flex gap-3">
              {['twitter', 'discord', 'linkedin'].map((social) => (
                <button
                  key={social}
                  className="hover:opacity-80 transition-opacity"
                  aria-label={social}
                >
                  {social === 'twitter' && '𝕏'}
                  {social === 'discord' && '💬'}
                  {social === 'linkedin' && '🔗'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`sticky top-0 z-40 w-full transition-all ${
          isScrolled
            ? 'bg-white shadow-md'
            : 'bg-white/95 backdrop-blur-sm shadow-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-2xl">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">V</span>
            </div>
            <span className="text-secondary">VoxHealth</span>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Features', 'For Doctors', 'Pricing', 'About'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(' ', '-')}`}
                className="text-secondary hover:text-primary transition-colors text-sm font-medium"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right CTAs */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-shadow"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}
