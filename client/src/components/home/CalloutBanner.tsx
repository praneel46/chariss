import React from 'react';
import { Sparkles, ArrowUpRight, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CalloutBanner: React.FC = () => {
  return (
    <section className="bg-[#D4A359] text-[#151419] py-16 sm:py-20 px-4 text-center relative overflow-hidden">
      {/* Decorative background watermark */}
      <div
        aria-hidden="true"
        className="absolute -right-10 -bottom-10 text-[20vw] font-serif font-black text-black/[0.04] select-none pointer-events-none"
      >
        ✦
      </div>

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        
        {/* Mascot / Icon Badge (Observed in reference mobile video) */}
        <div className="w-12 h-12 rounded-full bg-[#151419] text-[#D4A359] flex items-center justify-center mx-auto shadow-md">
          <Gift className="w-6 h-6" />
        </div>

        <p className="text-xs uppercase font-mono tracking-[0.2em] font-bold text-[#151419]/80">
          GENUINE CONNECTION DOES NOT WAIT
        </p>

        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#151419] leading-tight break-words">
          FIND THE GIFT THEY WILL
          <br />
          <span className="text-white drop-shadow-xs">TREASURE FOREVER.</span>
        </h2>

        <p className="text-sm sm:text-base text-[#151419]/85 max-w-xl mx-auto leading-relaxed">
          Skip generic gift cards and hurried supermarket chocolates. Discover handcrafted heirlooms selected specifically for who they are.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/consultation"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-[#151419] text-[#FAF9F6] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-brutal-dark hover:bg-[#292820] transition-all cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-[#D4A359]" />
            <span>Start Free Consultation</span>
            <ArrowUpRight className="w-4 h-4 text-[#D4A359] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <p className="text-xs font-mono text-[#151419]/70 pt-2">
          Small batches. Unlimited sincere memories.
        </p>

      </div>
    </section>
  );
};
