import React, { useEffect } from 'react';
import { LoadWipe } from '../components/kolibrie/LoadWipe';
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

      {/* Main 3-Section Experience */}
      <main className="w-full relative bg-[var(--page)] transition-colors duration-700">
        {/* Section 1: 100vh Hero with Looping Video & Follower Card */}
        <HeroKolibrie />

        {/* Section 2: Pinned 3D Drops Stack (Real Luxury Items: Watch, Perfume, Sunglasses, Ring, Bag) */}
        <DropsStackKolibrie />

        {/* Section 3: Tall Sticky Curators Section with Dark Theme & Inertia Swipe */}
        <TeamFlockKolibrie />
      </main>
    </>
  );
};

export default Home;
