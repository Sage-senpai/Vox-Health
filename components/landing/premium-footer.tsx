'use client';

import { Github, Twitter, Linkedin } from 'lucide-react';

export function PremiumFooter() {
  return (
    <footer className="w-full bg-background text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        {/* Four-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Column 1 - About */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 border border-primary flex items-center justify-center">
                <span className="text-primary font-serif font-bold text-sm">V</span>
              </div>
              <span className="font-serif font-bold text-lg">VoxHealth</span>
            </div>
            <p className="text-white/60 text-sm font-light mb-6">
              Voice-first medical journaling powered by AI and Web3.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/40 hover:text-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-white/40 hover:text-primary transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="text-white/40 hover:text-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2 - Product */}
          <div>
            <h4 className="font-serif font-bold text-sm mb-6 text-white">Product</h4>
            <ul className="space-y-3 text-sm text-white/60 font-light">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">For Doctors</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div>
            <h4 className="font-serif font-bold text-sm mb-6 text-white">Company</h4>
            <ul className="space-y-3 text-sm text-white/60 font-light">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <h4 className="font-serif font-bold text-sm mb-6 text-white">Legal</h4>
            <ul className="space-y-3 text-sm text-white/60 font-light">
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">HIPAA</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-white/40 font-light tracking-wide">
            © 2026 VOXHEALTH. ALL RIGHTS RESERVED.
          </p>
          <p className="text-xs text-white/40 font-light tracking-wide">
            Powered by Solana • ElevenLabs • Ledger
          </p>
        </div>
      </div>
    </footer>
  );
}
