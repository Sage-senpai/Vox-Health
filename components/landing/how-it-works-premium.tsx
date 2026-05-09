'use client';

import { Mic, Lock, BarChart3, QrCode } from 'lucide-react';

export function HowItWorksPremium() {
  const features = [
    {
      icon: Mic,
      title: 'Record Your Voice',
      description: 'Speak symptoms naturally. AI asks follow-up questions.',
    },
    {
      icon: Lock,
      title: 'Encrypted Storage',
      description: 'Records locked on your Ledger hardware wallet.',
    },
    {
      icon: BarChart3,
      title: 'AI Analysis',
      description: 'Pattern detection alerts you and your doctor to changes.',
    },
    {
      icon: QrCode,
      title: 'Instant Sharing',
      description: 'Generate QR code for any doctor to access your timeline.',
    },
  ];

  return (
    <section className="w-full bg-[#FAF9F6] py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        {/* Section title */}
        <h2 className="text-5xl md:text-6xl font-serif font-bold text-center text-[#0A1628] mb-8">
          How VoxHealth Works
        </h2>

        {/* Four-column icon feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E5E7EB]"
              >
                {/* Icon - 64px mint green */}
                <div className="inline-flex p-4 rounded-xl mb-6 bg-[#A8E6CF] text-[#0A1628]">
                  <Icon className="w-8 h-8" />
                </div>

                {/* Title - 20px, bold, dark */}
                <h3 className="text-xl font-bold text-[#0A1628] mb-3">
                  {feature.title}
                </h3>

                {/* Description - 16px, gray, 2 lines max */}
                <p className="text-base text-[#6B7280] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
