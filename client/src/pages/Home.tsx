import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoadWipe } from '../components/kolibrie/LoadWipe';
import { CursorMarquee } from '../components/kolibrie/CursorMarquee';
import { KolibrieNav } from '../components/kolibrie/KolibrieNav';
import { HeroKolibrie } from '../components/kolibrie/HeroKolibrie';
import { DropsStackKolibrie } from '../components/kolibrie/DropsStackKolibrie';
import { TeamFlockKolibrie } from '../components/kolibrie/TeamFlockKolibrie';
import { setupKolibrieEngine } from '../components/kolibrie/KolibrieInit';

export const Home: React.FC = () => {
  useEffect(() => {
    const cleanup = setupKolibrieEngine();
    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <>
      {/* 5.1 Fixed Fullscreen Load Wipe Overlay */}
      <LoadWipe />

      {/* 5.2 Fixed Floating Cursor Label ("View gift →") */}
      <CursorMarquee />

      {/* 5.3 Fixed Top Navigation */}
      <KolibrieNav />

      {/* Main 3-Section Experience */}
      <main className="w-full relative bg-[var(--page)] transition-colors duration-700">
        {/* Section 1: 100vh Hero with Looping Video & Follower Card */}
        <HeroKolibrie />

        {/* Section 2: Pinned 3D Drops Stack */}
        <DropsStackKolibrie />

        {/* Section 3: Tall Sticky Curators Section with Dark Theme & Inertia Swipe */}
        <TeamFlockKolibrie />

        {/* Closing Atelier Footer */}
        <footer className="relative z-10 w-full py-[4rem] px-[2rem] bg-[#141110] text-[#faf3e4] border-t border-[#faf3e4]/10 flex flex-col md:flex-row items-center justify-between gap-[2rem]">
          <div className="flex items-center gap-[1.5rem]">
            <span className="font-yellowtail text-[#ef4a23] text-[2.5rem] leading-none inline-block -rotate-6">
              charis.
            </span>
            <span className="text-[0.9rem] font-playfair tracking-wide text-[#faf3e4]/60">
              AI-calibrated sentiment & luxury gifting atelier
            </span>
          </div>

          <div className="flex items-center gap-[2rem] font-archivo uppercase text-[0.95rem] tracking-wider text-[#faf3e4]/80">
            <Link to="/consultation" className="hover:text-[#ef4a23] transition-colors">
              AI Consultation
            </Link>
            <Link to="/gift-studio" className="hover:text-[#ef4a23] transition-colors">
              Gift Studio
            </Link>
            <Link to="/discover" className="hover:text-[#ef4a23] transition-colors">
              Archive
            </Link>
            <Link to="/login" className="hover:text-[#ef4a23] transition-colors">
              Account
            </Link>
          </div>

          <p className="text-[0.8rem] font-mono text-[#faf3e4]/40">
            © {new Date().getFullYear()} CHARIS Atelier. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  );
};

export default Home;
