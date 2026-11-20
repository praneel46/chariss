import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface OccasionDef {
  key: string;
  slug: string;
  subtitle: string;
  desc: string;
  c1: string;
  c2: string;
  image: string;
  fx: 'balloon' | 'heart' | 'petal' | 'glow' | 'butterfly';
}

export const OccasionSection: React.FC = () => {
  const [activeOccasion, setActiveOccasion] = useState<string | null>('Birthday');

  const OCCASIONS: OccasionDef[] = [
    {
      key: 'Birthday',
      slug: 'birthday',
      subtitle: 'Milestones & Solar Returns',
      desc: 'Candles, keepsakes and small handcrafted surprises for another year around the sun.',
      c1: '#3a1f2b',
      c2: '#c4566b',
      image: '/images/occasions/birthday.webp',
      fx: 'balloon',
    },
    {
      key: 'Anniversary',
      slug: 'anniversary',
      subtitle: 'Devotion & Shared Time',
      desc: 'Warm, lasting heirlooms and commemorative pieces for the years you have built together.',
      c1: '#3b1a1a',
      c2: '#b5483d',
      image: '/images/occasions/anniversary.webp',
      fx: 'heart',
    },
    {
      key: 'Thank You',
      slug: 'thank-you',
      subtitle: 'Genuine Appreciation',
      desc: 'Gentle, exquisite gestures that convey heartfelt gratitude with poise and eloquence.',
      c1: '#1f2f27',
      c2: '#6f9a7e',
      image: '/images/occasions/thank-you.webp',
      fx: 'petal',
    },
    {
      key: 'Housewarming',
      slug: 'housewarming',
      subtitle: 'Sanctuary & New Beginnings',
      desc: 'Tactile ceramics, ambient lighting, and objects that turn a newly opened house into home.',
      c1: '#3a2a14',
      c2: '#d2994a',
      image: '/images/occasions/housewarming.webp',
      fx: 'glow',
    },
    {
      key: 'Farewell',
      slug: 'farewell',
      subtitle: 'Journeys & Lasting Bonds',
      desc: 'Something treasured to carry along when distance grows but the emotional bond endures.',
      c1: '#1b2733',
      c2: '#6d8fb0',
      image: '/images/occasions/farewell.webp',
      fx: 'butterfly',
    },
  ];

  const renderFx = (kind: OccasionDef['fx']) => {
    const items = [];
    const n = kind === 'glow' ? 12 : 8;
    for (let i = 0; i < n; i++) {
      const left = (i * 13 + 7) % 90;
      const top = (i * 11 + 12) % 82;
      const delay = (i * 0.65).toFixed(2);
      const duration = (6 + (i % 4) * 2.2).toFixed(2);

      if (kind === 'balloon') {
        const bg = ['#ef4a23', '#ffd46e', '#f6a9c2', '#FAF3E4', '#8fc6e8'][i % 5];
        items.push(
          <i
            key={i}
            style={{
              left: `${left}%`,
              bottom: '-45px',
              width: `${16 + (i % 3) * 4}px`,
              height: `${22 + (i % 3) * 6}px`,
              borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
              background: bg,
              opacity: 0.75,
              animation: `rise ${duration}s ${delay}s linear infinite`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          />
        );
      } else if (kind === 'heart') {
        items.push(
          <i
            key={i}
            style={{
              left: `${left}%`,
              bottom: '-35px',
              animation: `rise ${duration}s ${delay}s linear infinite`,
              opacity: 0.8,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M12 21S3 15 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 15 12 21 12 21z"
                fill={i % 2 === 0 ? '#ef4a23' : '#ffd46e'}
              />
            </svg>
          </i>
        );
      } else if (kind === 'petal') {
        items.push(
          <i
            key={i}
            style={{
              left: `${left}%`,
              top: '-25px',
              width: '14px',
              height: '18px',
              borderRadius: '100% 0 100% 0',
              background: i % 2 === 0 ? '#f6a9c2' : '#b9c48a',
              animation: `fall ${duration}s ${delay}s linear infinite`,
              opacity: 0.85,
            }}
          />
        );
      } else if (kind === 'glow') {
        items.push(
          <i
            key={i}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${8 + (i % 3) * 4}px`,
              height: `${8 + (i % 3) * 4}px`,
              borderRadius: '50%',
              background: '#ffd46e',
              boxShadow: '0 0 18px #ffd46e, 0 0 32px #ef4a23',
              animation: `glow ${duration}s ${delay}s ease-in-out infinite`,
            }}
          />
        );
      } else if (kind === 'butterfly') {
        items.push(
          <i
            key={i}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animation: `drift ${duration}s ${delay}s ease-in-out infinite`,
              opacity: 0.85,
            }}
          >
            <svg width="22" height="18" viewBox="0 0 24 20" fill="none">
              <path
                d="M12 10C8 2 2 3 1 7C0 11 5 15 12 11C19 15 24 11 23 7C22 3 16 2 12 10Z"
                fill="rgba(255, 243, 228, 0.85)"
              />
            </svg>
          </i>
        );
      }
    }
    return items;
  };

  useEffect(() => {
    if (window.innerWidth < 768) {
      setActiveOccasion('Birthday');
    }
  }, []);

  return (
    <section
      id="occasions"
      className="w-full py-[5rem] sm:py-[7rem] px-4 sm:px-8 bg-[#141110] text-[#faf3e4] relative overflow-hidden border-t border-[#faf3e4]/10"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#ef4a23]/5 rounded-full blur-[140px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10 sm:space-y-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#faf3e4]/10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-archivo uppercase tracking-widest text-[#ffd46e] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#ef4a23]" />
              Shop by Occasion
            </div>
            <h2 className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#faf3e4] leading-[1.1]">
              Every occasion deserves <br />
              <span className="italic font-normal text-[#ffd46e]">something meaningful.</span>
            </h2>
          </div>
          <p className="font-archivo text-sm sm:text-base text-[#faf3e4]/70 max-w-md leading-relaxed font-light">
            Explore curated artisan expressions tailored to the exact emotional resonance of life’s most cherished celebrations.
          </p>
        </div>

        {/* Interactive 3D / Accordion Occasion Showcase */}
        <div
          className="occ-container"
          onMouseLeave={() => {
            if (window.innerWidth >= 768) {
              setActiveOccasion('Birthday');
            }
          }}
        >
          {OCCASIONS.map((o) => {
            const isOpen = activeOccasion === o.key;

            return (
              <div
                key={o.key}
                className={`occ-panel ${isOpen ? 'active' : ''}`}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                style={{
                  ['--c1' as any]: o.c1,
                  ['--c2' as any]: o.c2,
                }}
                onClick={() => {
                  if (window.innerWidth < 768 && isOpen) {
                    setActiveOccasion(null);
                  } else {
                    setActiveOccasion(o.key);
                  }
                }}
                onMouseEnter={() => {
                  if (window.innerWidth >= 768) {
                    setActiveOccasion(o.key);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveOccasion(isOpen ? null : o.key);
                  }
                }}
              >
                {/* Background Curated Editorial Image with Zoom Hover */}
                <img
                  src={o.image}
                  alt={o.key}
                  className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-700 ${
                    isOpen ? 'scale-105 opacity-40' : 'opacity-25'
                  }`}
                  loading="lazy"
                />

                {/* Particle Animation FX Layer */}
                <div className="occ-fx" aria-hidden="true">
                  {renderFx(o.fx)}
                </div>

                {/* Content Body */}
                <div className="occ-body">
                  <h3 className="occ-title">{o.key}</h3>

                  <div className="occ-more space-y-3 pt-2">
                    <p className="text-xs uppercase tracking-widest font-archivo font-bold text-[#ffd46e]/90">
                      {o.subtitle}
                    </p>
                    <p className="text-sm font-archivo font-light text-[#faf3e4]/90 max-w-md leading-relaxed">
                      {o.desc}
                    </p>
                    <div className="pt-2">
                      <Link
                        to={`/occasions?type=${o.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ef4a23] hover:bg-[#ffd46e] hover:text-[#141110] text-white text-xs font-archivo font-bold uppercase tracking-wider transition-all shadow-md group"
                      >
                        Explore Gifts
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
