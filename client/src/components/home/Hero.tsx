import React from 'react';
import { Sparkles, ArrowUpRight, Gift, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-24 bg-gradient-to-b from-[#F7F3EB] via-[#EDE5DA]/50 to-[#F7F3EB] border-b border-[#292820]/8">
      {/* Subtle luxury ambient radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#DCCFC1]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Eyebrow with sparkles */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-[#B69A78]">✦</span>
          <span className="text-[11px] sm:text-xs uppercase font-mono tracking-[0.25em] text-[#292820]/75 font-semibold">
            THE ART OF THOUGHTFUL INTENT
          </span>
          <span className="text-[#B69A78]">✦</span>
        </div>

        {/* Refined Editorial Headline (Balanced proportion & luxury typography) */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#292820] leading-[1.08] break-words">
            ALL FEELINGS.
            <br />
            <span className="text-[#B69A78]">NO GUESSWORK.</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-[#292820]/80 font-normal max-w-xl mx-auto leading-relaxed">
            Raw emotional intelligence. Intelligent smart wearables, timepieces, luxury leather & fine novelties. A platform that listens before recommending.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            to="/consultation"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-md bg-[#151419] text-[#FAF9F6] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-brutal hover:bg-[#292820] transition-all duration-200 group cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-[#D4A359] group-hover:rotate-12 transition-transform" />
            <span>Start Free Consultation</span>
            <ArrowUpRight className="w-4 h-4 text-[#D4A359]" />
          </Link>

          <Link
            to="/discover"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md bg-white/80 text-[#292820] text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-white transition-all border border-[#292820]/15 shadow-xs"
          >
            <Compass className="w-4 h-4 text-[#B69A78]" />
            <span>Explore Curated Gifts</span>
          </Link>
        </div>

        {/* Interactive Floating Polaroid Stage (Designer Glasses, Watch, Luxury Bag) */}
        <div className="relative mt-2 max-w-4xl mx-auto">
          
          {/* Starburst Deal Badge Sticker (Tilted 14deg like the video) */}
          <div className="absolute -top-8 right-2 sm:right-12 z-20 hidden md:block">
            <div className="relative rotate-12 transform hover:rotate-6 transition-transform cursor-default">
              <div className="w-22 h-22 rounded-full bg-[#D4A359] text-[#151419] p-2 flex flex-col items-center justify-center text-center shadow-lg border-2 border-dashed border-[#FAF9F6]">
                <span className="text-[9px] uppercase font-mono font-bold tracking-tight">AI MATCH</span>
                <span className="font-display font-extrabold text-base leading-tight">100%</span>
                <span className="text-[8px] font-mono tracking-tighter uppercase font-semibold">VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Dotted Flight Trail with Mascot */}
          <div className="hidden lg:flex items-center gap-2 absolute top-2 left-6 z-10 text-xs font-handwriting text-[#B69A78]">
            <span className="border-t-2 border-dotted border-[#B69A78] w-14 inline-block" />
            <Gift className="w-4 h-4 text-[#B69A78] -rotate-12" />
            <span className="text-sm font-semibold">Delivered with grace</span>
          </div>

          {/* Polaroid Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 items-center justify-items-center">
            
            {/* Polaroid 1: Ray-Ban Meta Smart Glasses / Designer Sunglasses */}
            <div className="w-full max-w-[270px] bg-white p-3.5 pb-6 rounded-xs shadow-polaroid transform -rotate-2 hover:rotate-0 hover:scale-102 transition-all duration-300 border border-stone-200">
              <div className="aspect-square overflow-hidden rounded-xs bg-[#EDE5DA]">
                <img
                  src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"
                  alt="Ray-Ban Meta Smart Glasses"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-3.5 text-center font-handwriting text-xl text-[#292820] font-bold">
                Framing every glance.
              </p>
            </div>

            {/* Polaroid 2: Apple Watch Series 11 / Luxury Timepiece (Center Highlight) */}
            <div className="w-full max-w-[270px] bg-white p-3.5 pb-6 rounded-xs shadow-polaroid transform sm:-translate-y-4 rotate-1 hover:rotate-0 hover:scale-102 transition-all duration-300 border border-stone-200">
              <div className="aspect-square overflow-hidden rounded-xs bg-[#EDE5DA]">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
                  alt="Apple Watch Series 11"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-3.5 text-center font-handwriting text-xl text-[#292820] font-bold">
                Every moment counts.
              </p>
            </div>

            {/* Polaroid 3: Italian Saffiano Leather Bag / Oura Ring */}
            <div className="w-full max-w-[270px] bg-white p-3.5 pb-6 rounded-xs shadow-polaroid transform rotate-3 hover:rotate-0 hover:scale-102 transition-all duration-300 border border-stone-200 sm:col-span-2 md:col-span-1">
              <div className="aspect-square overflow-hidden rounded-xs bg-[#EDE5DA]">
                <img
                  src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80"
                  alt="Italian Leather Luxury Bag"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-3.5 text-center font-handwriting text-xl text-[#292820] font-bold">
                Crafted with grace.
              </p>
            </div>

          </div>

          {/* Under-hero handwritten quote */}
          <div className="mt-8 text-center">
            <p className="font-handwriting text-2xl md:text-3xl text-[#292820]/75">
              “Made with grace. Remembered forever.”
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
