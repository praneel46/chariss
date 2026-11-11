import React from 'react';
import { Hero } from '../components/home/Hero';
import { CountdownBanner } from '../components/home/CountdownBanner';
import { OccasionSection } from '../components/home/OccasionSection';
import { HowItWorks } from '../components/home/HowItWorks';
import { FeaturedGifts } from '../components/home/FeaturedGifts';
import { GiftStudioTeaser } from '../components/home/GiftStudioTeaser';
import { TrustBar } from '../components/home/TrustBar';
import { FAQSection } from '../components/home/FAQSection';
import { CalloutBanner } from '../components/home/CalloutBanner';

export const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <CountdownBanner />
      <OccasionSection />
      <HowItWorks />
      <FeaturedGifts />
      <GiftStudioTeaser />
      <TrustBar />
      <FAQSection />
      <CalloutBanner />
    </main>
  );
};
