import React from 'react';
import { Sparkles, ShieldCheck, Lock, HeartHandshake } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const pillars = [
    {
      icon: Sparkles,
      title: 'Explainable AI Matching',
      subtitle: 'Transparent rationale for every single recommendation.'
    },
    {
      icon: ShieldCheck,
      title: 'Verified Merchant Links',
      subtitle: 'Real catalogue items from vetted artisans. No fake carts.'
    },
    {
      icon: Lock,
      title: 'Confidential Consultation',
      subtitle: 'Zero data harvesting. Your private sentiments stay private.'
    },
    {
      icon: HeartHandshake,
      title: 'Bespoke Keepsake Wrap',
      subtitle: 'Complimentary ribbon, custom card & studio packaging.'
    }
  ];

  return (
    <section id="trust" className="py-16 bg-[#EDE5DA]/40 border-b border-[#292820]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FAF9F6] border border-[#292820]/10 flex items-center justify-center text-[#B69A78] shrink-0 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#292820]">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#292820]/70 mt-1 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
