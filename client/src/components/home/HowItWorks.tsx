import React from 'react';
import { ArrowUpRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#FAF9F6] border-b border-[#292820]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetrical 2-Column Layout (Forensic match to video sec 10) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Bold Editorial Identity */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B69A78] font-bold">
              <span>03</span>
              <span>/</span>
              <span>Our Philosophy</span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase text-[#292820] tracking-tight leading-[1.05] break-words">
              BEHIND EVERY GIFT,
              <br />
              <span className="text-[#D4A359]">A MEANINGFUL STORY.</span>
            </h2>

            <p className="text-base text-[#292820]/80 leading-relaxed">
              Most platforms recommend generic bestsellers. CHARIS begins with empathy: who they are, how they spend quiet afternoons, and the unspoken gratitude you wish to convey.
            </p>

            {/* Hand-drawn flower / accent with cursive quote (observed in video) */}
            <div className="pt-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#EDE5DA] flex items-center justify-center text-[#B69A78]">
                <Heart className="w-6 h-6 stroke-[1.5]" />
              </div>
              <p className="font-handwriting text-2xl text-[#292820] font-bold">
                Give kindly. Stay sincere.
              </p>
            </div>
          </div>

          {/* Right Column: 3 Numbered Steps */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2 border-b border-[#292820]/10 pb-6">
              <h3 className="font-serif text-2xl font-bold text-[#292820]">
                The sentiment is yours. We help you find its shape.
              </h3>
              <p className="text-sm text-[#292820]/70">
                CHARIS pairs deep contextual LLM consultation with an internal catalog of verified artisan pieces.
              </p>
            </div>

            {/* Step 1 */}
            <div className="flex gap-6 items-start group">
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#D4A359] font-mono shrink-0">
                01
              </span>
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-[#292820] group-hover:text-[#B69A78] transition-colors">
                  Tell us about them.
                </h4>
                <p className="text-sm text-[#292820]/75 leading-relaxed">
                  Share their relationship to you, personality traits, subtle quirks, and daily rituals. Skip anything sensitive at any time.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start group">
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#D4A359] font-mono shrink-0">
                02
              </span>
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-[#292820] group-hover:text-[#B69A78] transition-colors">
                  Share your emotional intent.
                </h4>
                <p className="text-sm text-[#292820]/75 leading-relaxed">
                  Whether you want to express quiet appreciation, celebrate a breakthrough, or offer comfort — set your desired feeling and INR budget.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start group">
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#D4A359] font-mono shrink-0">
                03
              </span>
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-[#292820] group-hover:text-[#B69A78] transition-colors">
                  Receive verified recommendations & gift card.
                </h4>
                <p className="text-sm text-[#292820]/75 leading-relaxed">
                  Explore 5–10 real catalogue products with transparent match rationale, and personalize a keepsake card in our AI Gift Studio.
                </p>
              </div>
            </div>

            {/* Action Link */}
            <div className="pt-4">
              <Link
                to="/consultation"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#292820] hover:text-[#B69A78] font-bold border-b border-[#292820] hover:border-[#B69A78] pb-1 transition-colors"
              >
                <span>Experience the Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
