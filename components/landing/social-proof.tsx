'use client';

import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Margaret Chen',
    role: 'Patient, 68',
    content: 'Finally, a simple way to track my health. Speaking is so much easier than typing out all my symptoms.',
    rating: 5,
  },
  {
    name: 'Dr. James Mitchell',
    role: 'Cardiologist',
    content: 'My patients love VoxHealth. The detailed voice logs give me much better insight into their daily experiences.',
    rating: 5,
  },
  {
    name: 'Robert Williams',
    role: 'Patient, 72',
    content: 'I appreciate the privacy controls. I feel secure knowing only the doctors I approve can see my information.',
    rating: 5,
  },
];

export function SocialProof() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Loved by Patients & Doctors
          </h2>
          <p className="text-lg text-ink-muted max-w-2xl mx-auto">
            Hear from real users who&apos;ve transformed their health management.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="p-8 bg-background rounded-lg border border-border hover:border-primary/30 hover:shadow-lg transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-ink-muted">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-serif font-bold text-primary mb-2">10K+</p>
            <p className="text-ink-muted">Active Patients</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-bold text-primary mb-2">4.9★</p>
            <p className="text-ink-muted">Average Rating</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-bold text-primary mb-2">500+</p>
            <p className="text-ink-muted">Partnered Doctors</p>
          </div>
        </div>
      </div>
    </section>
  );
}
