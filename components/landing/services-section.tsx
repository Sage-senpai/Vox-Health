'use client';

import { Heart, Stethoscope, Users, ArrowRight } from 'lucide-react';

export function ServicesSection() {
  const services = [
    {
      icon: Heart,
      title: 'For Patients',
      description: 'Take control of your medical records. Never forget symptoms. Share with any doctor instantly.',
      bgColor: 'bg-[#14B8A6]',
      features: [
        'Voice-first journaling',
        'Medication reminders',
        'Encrypted storage',
      ],
    },
    {
      icon: Stethoscope,
      title: 'For Healthcare Providers',
      description: 'Access complete patient histories in seconds. Hear their voice, understand their context.',
      bgColor: 'bg-[#6366F1]',
      features: [
        'QR code patient access',
        'Audio playback',
        'Timeline visualization',
      ],
    },
    {
      icon: Users,
      title: 'For Family Caregivers',
      description: 'Monitor elderly parents. Track medication compliance. Peace of mind from anywhere.',
      bgColor: 'bg-[#FF6B6B]',
      features: [
        'Remote monitoring',
        'Alerts for missed meds',
        'Multi-patient dashboard',
      ],
    },
  ];

  return (
    <section className="w-full bg-white py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        {/* Section title */}
        <h2 className="text-5xl md:text-6xl font-serif font-bold text-center text-[#0A1628] mb-20">
          Built for Everyone
        </h2>

        {/* Three-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className={`${service.bgColor} rounded-3xl p-10 text-white flex flex-col group hover:shadow-2xl transition-shadow duration-300`}
              >
                {/* Icon at top */}
                <Icon className="w-12 h-12 mb-6" />

                {/* Title - 24px, bold */}
                <h3 className="text-3xl font-bold mb-4">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-lg leading-relaxed mb-8 flex-grow">
                  {service.description}
                </p>

                {/* Feature list */}
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xl">✓</span>
                      <span className="text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Learn More link */}
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-white hover:gap-3 transition-all font-semibold"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
