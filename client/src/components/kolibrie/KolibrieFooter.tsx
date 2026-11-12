import React from 'react';
import { Link } from 'react-router-dom';
import type { ModalType } from './AtelierAndFooterModals';

interface KolibrieFooterProps {
  onOpenModal: (type: ModalType) => void;
}

export const KolibrieFooter: React.FC<KolibrieFooterProps> = ({ onOpenModal }) => {
  return (
    <footer className="relative z-10 w-full pt-[5rem] pb-[3.5rem] px-[2rem] bg-[#141110] text-[#faf3e4] border-t border-[#faf3e4]/10 overflow-hidden">
      {/* Background Subtle Watermark */}
      <div
        aria-hidden="true"
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 select-none pointer-events-none font-yellowtail text-[18vw] text-white/[0.03] whitespace-nowrap leading-none z-0"
      >
        charis.
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Top Row: Brand & Tagline + 4 Interactive Highlights */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-10 border-b border-[#faf3e4]/10">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-yellowtail text-[#ef4a23] text-[3.2rem] leading-none inline-block -rotate-6">
                charis.
              </span>
              <span className="font-archivo text-xs uppercase tracking-widest text-[#ffd46e] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 font-bold">
                Atelier Edition
              </span>
            </div>
            <p className="text-[1.1rem] font-playfair tracking-wide text-[#faf3e4]/70 mt-2 max-w-md italic">
              All feelings, zero guesswork. Translating genuine human relationships into master atelier keepsakes.
            </p>
          </div>

          {/* Requested 4 Core Interactive Pillars with Animated Draw-Underline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
            <button
              onClick={() => onOpenModal('how-it-works')}
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-[#ef4a23] hover:text-white border border-white/10 text-left transition-all group cursor-pointer"
            >
              <span className="block font-archivo uppercase text-[0.8rem] font-bold tracking-wider group-hover:translate-x-1 transition-transform">
                How CHARIS Works →
              </span>
              <span className="block text-[0.75rem] font-playfair text-[#faf3e4]/60 group-hover:text-white/80 mt-0.5">
                3-Step Calibration
              </span>
            </button>

            <button
              onClick={() => onOpenModal('pricing-trust')}
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-[#ef4a23] hover:text-white border border-white/10 text-left transition-all group cursor-pointer"
            >
              <span className="block font-archivo uppercase text-[0.8rem] font-bold tracking-wider group-hover:translate-x-1 transition-transform">
                Verified Pricing →
              </span>
              <span className="block text-[0.75rem] font-playfair text-[#faf3e4]/60 group-hover:text-white/80 mt-0.5">
                Zero Retail Markups
              </span>
            </button>

            <button
              onClick={() => onOpenModal('faq')}
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-[#ef4a23] hover:text-white border border-white/10 text-left transition-all group cursor-pointer"
            >
              <span className="block font-archivo uppercase text-[0.8rem] font-bold tracking-wider group-hover:translate-x-1 transition-transform">
                Frequent Questions →
              </span>
              <span className="block text-[0.75rem] font-playfair text-[#faf3e4]/60 group-hover:text-white/80 mt-0.5">
                Shipping & Engraving
              </span>
            </button>

            <button
              onClick={() => onOpenModal('privacy')}
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-[#ef4a23] hover:text-white border border-white/10 text-left transition-all group cursor-pointer"
            >
              <span className="block font-archivo uppercase text-[0.8rem] font-bold tracking-wider group-hover:translate-x-1 transition-transform">
                Privacy Safeguards →
              </span>
              <span className="block text-[0.75rem] font-playfair text-[#faf3e4]/60 group-hover:text-white/80 mt-0.5">
                Discrete Packaging
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Navigation Links & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 text-xs">
          <div className="flex flex-wrap items-center gap-6 font-archivo uppercase tracking-wider text-[#faf3e4]/80">
            <Link to="/consultation" className="hover:text-[#ef4a23] transition-colors">
              Start Consultation
            </Link>
            <Link to="/gift-studio" className="hover:text-[#ef4a23] transition-colors">
              Gift Studio (100 Curated)
            </Link>
            <button
              onClick={() => onOpenModal('ateliers')}
              className="hover:text-[#ef4a23] transition-colors uppercase font-archivo cursor-pointer"
            >
              What are Ateliers?
            </button>
            <Link to="/login" className="hover:text-[#ef4a23] transition-colors">
              Account
            </Link>
          </div>

          <p className="font-mono text-[#faf3e4]/50 text-center sm:text-right">
            © {new Date().getFullYear()} CHARIS Atelier. All emotional curations protected.
          </p>
        </div>
      </div>
    </footer>
  );
};
