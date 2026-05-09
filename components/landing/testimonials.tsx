'use client';

import { Star } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      quote: 'VoxHealth helped my doctor catch a dangerous pattern in my symptoms. The voice timeline showed what I couldn\'t remember.',
      name: 'Margaret',
      age: 68,
      condition: 'Diabetes',
    },
    {
      quote: 'As someone with Parkinson\'s, typing is nearly impossible. VoxHealth gives me independence.',
      name: 'Robert',
      age: 71,
      condition: 'Parkinson\'s',
    },
    {
      quote: 'I can finally track my daughter\'s seizures accurately. The voice notes capture details I\'d forget.',
      name: 'Linda',
      age: 42,
      condition: 'Caregiver',
    },
  ];

  return (
    <section className="w-full bg-background py-32 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section title */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-serif font-black text-white mb-4 tracking-tight">
            Voices That Matter
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
        </div>

        {/* Three-column testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="relative border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-all group"
            >
              {/* Accent line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Quote */}
              <p className="font-serif text-lg text-white mb-8 leading-relaxed italic font-light">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* Author info */}
              <div className="flex items-start gap-4">
                {/* Minimal avatar */}
                <div className="w-12 h-12 border border-primary/50 flex-shrink-0" />
                <div>
                  <p className="font-serif font-semibold text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-white/60 font-light">
                    {testimonial.age} • {testimonial.condition}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
