import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import type { ModalType } from './AtelierAndFooterModals';

interface KolibrieFooterProps {
  onOpenModal?: (type: ModalType) => void;
}

export const KolibrieFooter: React.FC<KolibrieFooterProps> = () => {
  const giantRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (window.Lenis && (window as any).lenisInstance) {
      (window as any).lenisInstance.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const giant = giantRef.current;
    if (!giant) return;

    const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const spans = giant.querySelectorAll<HTMLSpanElement>('.giant-footer-letter');
    const gsap = (window as any).gsap;

    const handleMouseMove = (e: MouseEvent) => {
      spans.forEach((s) => {
        const r = s.getBoundingClientRect();
        const cxp = r.left + r.width / 2;
        const cyp = r.top + r.height / 2;
        const dx = e.clientX - cxp;
        const dy = e.clientY - cyp;
        const d = Math.hypot(dx, dy);
        const k = Math.max(0, 1 - d / 420);

        if (gsap) {
          gsap.to(s, {
            x: dx * 0.16 * k,
            y: dy * 0.12 * k - 10 * k,
            duration: 0.35,
            overwrite: 'auto',
          });
        }
        s.style.setProperty('--gx', `${e.clientX - r.left}px`);
        s.style.setProperty('--gy', `${e.clientY - r.top}px`);
      });
    };

    const handleMouseLeave = () => {
      spans.forEach((s) => {
        if (gsap) {
          gsap.to(s, {
            x: 0,
            y: 0,
            duration: 0.85,
            ease: 'elastic.out(1, 0.45)',
          });
        }
        s.style.removeProperty('--gx');
        s.style.removeProperty('--gy');
      });
    };

    giant.addEventListener('mousemove', handleMouseMove);
    giant.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      giant.removeEventListener('mousemove', handleMouseMove);
      giant.removeEventListener('mouseleave', handleMouseLeave);
      if (gsap) {
        spans.forEach((s) => gsap.killTweensOf(s));
      }
    };
  }, []);

  return (
    <footer className="relative z-0 w-full h-screen min-h-screen flex flex-col justify-between pt-20 sm:pt-24 pb-8 px-6 sm:px-12 bg-[#141110] text-[#faf3e4] overflow-hidden select-none">
      {/* Background Subtle Watermark */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none font-yellowtail text-[22vw] text-white/[0.015] whitespace-nowrap leading-none z-0"
      >
        charis.
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-between h-full">
        {/* Minimalist Top Bar: Clean & Elegant */}
        <div className="flex items-center justify-between border-b border-[#faf3e4]/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#ef4a23] animate-pulse" />
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#faf3e4]/70 font-bold">
              YOU'VE REACHED THE SANCTUARY
            </span>
          </div>

          <span className="font-mono text-[11px] text-[#ffd46e] tracking-widest uppercase font-bold hidden sm:inline-block">
            EST. 2026 · ATELIER EDITION
          </span>
        </div>

        {/* Centerpiece: Monumental, Grand Scale CHARIS */}
        <div className="my-auto py-2 sm:py-6 flex items-center justify-center overflow-hidden w-full">
          <div
            ref={giantRef}
            className="giant-footer-charis select-none flex items-center justify-center gap-1 sm:gap-3 md:gap-5 w-full"
            aria-label="CHARIS"
          >
            {'CHARIS'.split('').map((char, index) => (
              <span
                key={index}
                className="giant-footer-letter cursor-default font-archivo tracking-tighter text-[19vw] sm:text-[18vw] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#faf3e4] via-[#faf3e4] to-[#ef4a23] drop-shadow-[0_20px_50px_rgba(239,74,35,0.25)]"
                style={{ fontStretch: '72%' }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Row: Navigation Links, Back to Top, and Copyright */}
        <div className="pt-6 border-t border-[#faf3e4]/10 shrink-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            {/* Sitemap Quick Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 sm:gap-8 font-archivo uppercase tracking-widest text-[#faf3e4]/80 text-[11px] sm:text-xs font-bold">
              <Link to="/consultation" className="hover:text-[#ef4a23] transition-colors">
                Start Consultation
              </Link>
              <Link to="/gift-studio" className="hover:text-[#ef4a23] transition-colors">
                Gift Studio
              </Link>
              <Link to="/discover" className="hover:text-[#ef4a23] transition-colors">
                Discover
              </Link>
              <Link to="/occasions" className="hover:text-[#ef4a23] transition-colors">
                Occasions
              </Link>
            </div>

            {/* Back to Top Pill & Copyright (with right padding so floating audio player never overlaps) */}
            <div className="flex items-center gap-6 pr-0 lg:pr-24">
              <button
                onClick={scrollToTop}
                className="group flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#faf3e4]/70 hover:text-[#ffd46e] transition-colors cursor-pointer"
              >
                <span>BACK TO TOP</span>
                <div className="w-8 h-8 rounded-full border border-[#faf3e4]/30 flex items-center justify-center group-hover:border-[#ffd46e] group-hover:bg-[#ffd46e]/10 transition-all">
                  <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform text-[#ffd46e]" />
                </div>
              </button>

              <p className="font-mono text-[10px] sm:text-xs text-[#faf3e4]/50 hidden sm:block">
                © 2026 CHARIS Atelier.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default KolibrieFooter;
