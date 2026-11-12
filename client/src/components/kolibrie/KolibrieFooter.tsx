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

        {/* Member Access / Login & Sign Up Banner */}
        <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-archivo uppercase tracking-widest text-[#ffd46e] font-bold">
              <span>Member Sanctuary</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4a23]" />
              <span>Saved Consultation Memory</span>
            </div>
            <p className="font-playfair text-sm text-[#faf3e4]/75 italic max-w-xl">
              Save your calibrated emotional consultations, personalized framed gift cards, and chosen keepsakes securely across devices.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/login?mode=login"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white hover:text-[#141110] text-xs font-archivo uppercase tracking-wider font-bold transition-all text-[#faf3e4]"
            >
              Sign In
            </Link>
            <Link
              to="/login?mode=signup"
              className="px-5 py-2.5 rounded-full bg-[#ef4a23] hover:bg-[#ffd46e] hover:text-[#141110] text-white text-xs font-archivo uppercase tracking-wider font-bold transition-all shadow-md"
            >
              Create Account (Sign Up)
            </Link>
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
            <a href="/#curators" className="hover:text-[#ef4a23] transition-colors">
              Meet Curators
            </a>
            <Link to="/login?mode=login" className="hover:text-[#ef4a23] transition-colors">
              Sign In
            </Link>
            <Link to="/login?mode=signup" className="hover:text-[#ffd46e] font-bold transition-colors">
              Sign Up
            </Link>
            <button
              onClick={() => onOpenModal('ateliers')}
              className="hover:text-[#ef4a23] transition-colors uppercase font-archivo cursor-pointer"
            >
              What are Ateliers?
            </button>
          </div>

          <p className="font-mono text-[#faf3e4]/50 text-center sm:text-right">
            © {new Date().getFullYear()} CHARIS Atelier. All emotional curations protected.
          </p>
        </div>
      </div>
    </footer>
  );
};
