import React from 'react';
import { ArrowUp, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#151419] text-[#FAF9F6] pt-20 pb-12 relative overflow-hidden border-t border-[#292820]">
      {/* Background Giant Watermark Wordmark (Forensic match to video) */}
      <div
        aria-hidden="true"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 select-none pointer-events-none text-[15vw] font-serif font-black text-white/[0.03] tracking-tighter whitespace-nowrap leading-none z-0"
      >
        charis.
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-tight text-[#FAF9F6]">
                charis<span className="text-[#D4A359]">.</span>
              </span>
            </Link>
            <p className="text-sm text-[#FAF9F6]/75 max-w-sm leading-relaxed">
              Every gift has a feeling. Find yours. We translate genuine relationships, shared memories, and emotional nuances into deeply personal gift recommendations and handwritten cards.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#D4A359] font-mono tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Curated • Artisan Vetted • Zero Dark Patterns</span>
            </div>
          </div>

          {/* Explore Col */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#D4A359] font-bold">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#FAF9F6]/70">
              <li>
                <Link to="/discover" className="hover:text-[#FAF9F6] transition-colors">
                  All Curated Gifts
                </Link>
              </li>
              <li>
                <Link to="/occasions" className="hover:text-[#FAF9F6] transition-colors">
                  Occasion Guides
                </Link>
              </li>
              <li>
                <Link to="/gift-studio" className="hover:text-[#FAF9F6] transition-colors">
                  AI Gift Studio
                </Link>
              </li>
              <li>
                <Link to="/consultation" className="hover:text-[#FAF9F6] transition-colors">
                  Start AI Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* The Little Details Col */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#D4A359] font-bold">
              The Little Details
            </h4>
            <ul className="space-y-2.5 text-sm text-[#FAF9F6]/70">
              <li>
                <a href="#how-it-works" className="hover:text-[#FAF9F6] transition-colors">
                  How CHARIS Works
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-[#FAF9F6] transition-colors">
                  Verified Pricing & Trust
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#FAF9F6] transition-colors">
                  Frequent Questions
                </a>
              </li>
              <li>
                <span className="text-[#FAF9F6]/40 cursor-default">
                  Privacy Safeguards
                </span>
              </li>
            </ul>
          </div>

          {/* Studio & Mission */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#D4A359] font-bold">
              Charis Studio
            </h4>
            <p className="text-xs text-[#FAF9F6]/60 leading-relaxed">
              Curated from independent artisans across India and verified globally. Handcrafted packaging on every order.
            </p>
            <div className="pt-2">
              <Link
                to="/consultation"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#FAF9F6] text-[#151419] text-xs font-semibold uppercase tracking-wider hover:bg-[#D4A359] transition-colors"
              >
                <span>Find a Gift</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF9F6]/50">
          <div>
            © 2026 CHARIS. All the sweetness & goodwill reserved.
          </div>

          <div className="hidden md:flex items-center gap-2 text-stone-400">
            <span>Small batches</span>
            <span>•</span>
            <span>Sentimental intentions</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-[#D4A359] fill-[#D4A359]" /> for meaningful moments
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-[#FAF9F6] transition-colors cursor-pointer group"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
