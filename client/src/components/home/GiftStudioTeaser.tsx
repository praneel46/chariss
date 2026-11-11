import React from 'react';
import { ArrowUpRight, Sparkles, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GiftStudioTeaser: React.FC = () => {
  return (
    <section className="py-24 bg-[#FAF9F6] border-b border-[#292820]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Hero Card (Forensic match to video frame 07 & sec 32) */}
        <div className="rounded-2xl overflow-hidden shadow-xl border border-[#292820]/10 grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Atmospheric Box Imagery */}
          <div className="lg:col-span-6 relative min-h-[380px] lg:min-h-[500px] bg-[#EDE5DA]">
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80"
              alt="Artisanal gift box packing"
              className="w-full h-full object-cover"
            />
            {/* Atmospheric overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
            
            {/* Cursive Annotation (Observed in reference video) */}
            <div className="absolute bottom-6 left-6 z-10">
              <span className="font-handwriting text-2xl sm:text-3xl text-white sm:text-[#292820] drop-shadow-sm font-bold bg-white/70 backdrop-blur-xs px-4 py-1.5 rounded-sm">
                A box full of heartfelt things.
              </span>
            </div>
          </div>

          {/* Right Column: Dark Luxury Studio Brief */}
          <div className="lg:col-span-6 bg-[#151419] text-[#FAF9F6] p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D4A359] font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CHARIS CREATE • AI GIFT CARD STUDIO</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#FAF9F6]">
                Words as memorable as the gift itself.
              </h2>

              <p className="text-sm text-[#FAF9F6]/75 mt-4 leading-relaxed">
                Stuck on what to write? Our studio pairs your shared relationship and memories with an AI sentiment engine to craft bespoke letterpress cards.
              </p>

              {/* Numbered Steps */}
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold text-[#D4A359] pt-1">01</span>
                  <p className="text-sm text-[#FAF9F6]/85">
                    <strong>Choose a stationery aesthetic:</strong> Minimal floral, modern typography, or dark noir luxury.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold text-[#D4A359] pt-1">02</span>
                  <p className="text-sm text-[#FAF9F6]/85">
                    <strong>Dial your emotional tone:</strong> Heartfelt, poetic, playful, or formal.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold text-[#D4A359] pt-1">03</span>
                  <p className="text-sm text-[#FAF9F6]/85">
                    <strong>Live Canvas & Export:</strong> Live preview with custom fonts, colors, and direct high-res export.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Action & Microcopy */}
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Link
                to="/gift-studio"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md bg-[#FAF9F6] text-[#151419] text-xs font-bold uppercase tracking-wider hover:bg-[#D4A359] transition-all cursor-pointer group shadow-brutal"
              >
                <PenTool className="w-4 h-4 text-[#151419]" />
                <span>Open Gift Studio</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <span className="text-[11px] font-mono text-[#FAF9F6]/60">
                Included free with every consultation
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
