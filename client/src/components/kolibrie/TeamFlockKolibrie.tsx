import React, { useEffect, useRef } from 'react';

interface PhotoItem {
  side: 'left' | 'right';
  offset: string;
  top: string;
  width: string;
  rotate: number;
  speed: number;
  crop: string;
  label: string;
  labelRotate?: number;
  isBts?: boolean;
}

const PHOTOS: PhotoItem[] = [
  { side: 'left', offset: '2.5vw', top: '3%', width: '14rem', rotate: -4, speed: 1, crop: 'team1:0', label: 'Elena', labelRotate: -7 },
  { side: 'left', offset: '21vw', top: '19%', width: '11rem', rotate: 3, speed: 0.6, crop: 'bts:0', label: 'ON SET', isBts: true },
  { side: 'left', offset: '3vw', top: '33%', width: '13rem', rotate: 5, speed: 1.3, crop: 'team1:1', label: 'Sem', labelRotate: 4 },
  { side: 'left', offset: '23vw', top: '49%', width: '13.5rem', rotate: -3, speed: 0.8, crop: 'team2:3', label: 'Mila', labelRotate: -5 },
  { side: 'left', offset: '2vw', top: '64%', width: '11.5rem', rotate: -6, speed: 1.15, crop: 'bts:2', label: 'ATELIER LAB', isBts: true },
  { side: 'left', offset: '20vw', top: '79%', width: '14rem', rotate: 4, speed: 0.7, crop: 'team1:2', label: 'Daan', labelRotate: 6 },

  { side: 'right', offset: '3vw', top: '2%', width: '13.5rem', rotate: 4, speed: 0.75, crop: 'team2:0', label: 'Sofia', labelRotate: 5 },
  { side: 'right', offset: '22vw', top: '17%', width: '11rem', rotate: -5, speed: 1.25, crop: 'bts:1', label: 'CURATION 01', isBts: true },
  { side: 'right', offset: '2.5vw', top: '32%', width: '14rem', rotate: -3, speed: 0.9, crop: 'team2:1', label: 'Jules', labelRotate: -6 },
  { side: 'right', offset: '23vw', top: '48%', width: '13rem', rotate: 5, speed: 1.4, crop: 'team1:3', label: 'Yara', labelRotate: 4 },
  { side: 'right', offset: '3vw', top: '63%', width: '11.5rem', rotate: 6, speed: 0.65, crop: 'bts:3', label: 'CALIBRATION', isBts: true },
  { side: 'right', offset: '20vw', top: '78%', width: '14rem', rotate: -4, speed: 1.05, crop: 'team2:2', label: 'Kenji', labelRotate: -4 }
];

export const TeamFlockKolibrie: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const section = sectionRef.current;
    if (!section || !gsap || !ScrollTrigger) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 1. Page Theme Switch to Dark ---
    const themeST = ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 45%',
      refreshPriority: -1,
      onEnter: () => document.documentElement.setAttribute('data-theme', 'dark'),
      onEnterBack: () => document.documentElement.setAttribute('data-theme', 'dark'),
      onLeave: () => document.documentElement.removeAttribute('data-theme'),
      onLeaveBack: () => document.documentElement.removeAttribute('data-theme')
    });

    if (isReducedMotion) {
      return () => {
        themeST.kill();
        document.documentElement.removeAttribute('data-theme');
      };
    }

    // --- 2. Parallax Motion on Photo Cards ---
    const photoCards = section.querySelectorAll<HTMLElement>('.team-photo-card');
    const mm = gsap.matchMedia();

    mm.add('(min-width: 992px)', () => {
      const baseDistance = 320;
      photoCards.forEach((card) => {
        const speed = parseFloat(card.getAttribute('data-speed') || '1');
        gsap.fromTo(
          card,
          { y: baseDistance * speed },
          {
            y: -baseDistance * speed,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'clamp(top bottom)',
              end: 'clamp(bottom top)',
              scrub: true,
              invalidateOnRefresh: true,
              refreshPriority: -1
            }
          }
        );
      });
    });

    mm.add('(max-width: 991px) and (min-width: 480px)', () => {
      const baseDistance = 320 * 0.5;
      photoCards.forEach((card) => {
        const speed = parseFloat(card.getAttribute('data-speed') || '1');
        gsap.fromTo(
          card,
          { y: baseDistance * speed },
          {
            y: -baseDistance * speed,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'clamp(top bottom)',
              end: 'clamp(bottom top)',
              scrub: true,
              invalidateOnRefresh: true,
              refreshPriority: -1
            }
          }
        );
      });
    });

    mm.add('(max-width: 479px)', () => {
      const baseDistance = 320 * 0.3;
      photoCards.forEach((card) => {
        const speed = parseFloat(card.getAttribute('data-speed') || '1');
        gsap.fromTo(
          card,
          { y: baseDistance * speed },
          {
            y: -baseDistance * speed,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'clamp(top bottom)',
              end: 'clamp(bottom top)',
              scrub: true,
              invalidateOnRefresh: true,
              refreshPriority: -1
            }
          }
        );
      });
    });

    // --- 3. Momentum Hover / Swipe with InertiaPlugin (Desktop & Touch) ---
    let lastX = 0;
    let lastY = 0;
    let vx = 0;
    let vy = 0;

    const onPointerMove = (e: PointerEvent) => {
      vx = e.movementX || e.clientX - lastX;
      vy = e.movementY || e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        vx = clientX - lastX;
        vy = clientY - lastY;
        lastX = clientX;
        lastY = clientY;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        vx = 0;
        vy = 0;
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    const interactives = [...Array.from(photoCards), stampRef.current].filter(Boolean) as HTMLElement[];

    interactives.forEach((target) => {
      const triggerInertia = (clientX: number, clientY: number) => {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const F = clientX - centerX;
        const R = clientY - centerY;
        const dist = Math.hypot(F, R) || 1;
        const torque = (F * vy - R * vx) / dist;

        const clamp = (val: number, limit: number) => Math.max(-limit, Math.min(limit, val));

        if (window.InertiaPlugin) {
          gsap.to(target, {
            inertia: {
              x: { velocity: clamp(vx * 30, 1080), end: 0 },
              y: { velocity: clamp(vy * 30, 1080), end: 0 },
              rotation: { velocity: clamp(torque * 20, 60), end: 0 },
              resistance: 200
            }
          });
        }
      };

      target.addEventListener('pointerenter', (e: PointerEvent) => {
        triggerInertia(e.clientX, e.clientY);
      });

      target.addEventListener('touchend', (e: TouchEvent) => {
        const touch = e.changedTouches ? e.changedTouches[0] : null;
        if (touch) {
          triggerInertia(touch.clientX, touch.clientY);
        }
      });
    });

    return () => {
      themeST.kill();
      mm.revert();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchstart', onTouchStart);
      document.documentElement.removeAttribute('data-theme');
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="curators"
      data-page-theme="dark"
      className="relative w-full h-[340vh] max-[991px]:h-[260vh] bg-[var(--page)] transition-colors duration-700 ease-[cubic-bezier(0.65,0.05,0,1)]"
    >
      {/* Sticky Centred Title (z-index 1, behind passing photos) */}
      <div className="sticky top-0 left-0 w-full h-screen z-[1] flex items-center justify-center pointer-events-none px-[1.5rem]">
        <div className="flex flex-col items-center text-center gap-[1.4rem] max-[600px]:gap-[0.8rem] max-w-[36rem] max-[600px]:max-w-[85vw] relative">
          
          {/* Yellowtail Stamp Sticker */}
          <div
            ref={stampRef}
            className="absolute -top-[8rem] -left-[3rem] max-[600px]:-top-[3.2rem] max-[600px]:-left-[0.8rem] w-[10rem] max-[600px]:w-[5rem] pointer-events-auto cursor-grab active:cursor-grabbing select-none"
            style={{
              transform: 'rotate(-10deg)',
              willChange: 'transform'
            }}
          >
            <svg viewBox="0 0 220 130" className="w-full h-auto drop-shadow-md">
              <ellipse
                cx="110"
                cy="65"
                rx="104"
                ry="58"
                fill="#faf3e4"
                stroke="#ef4a23"
                strokeWidth="10"
              />
              <text
                x="110"
                y="74"
                fill="#ef4a23"
                fontSize="54"
                textAnchor="middle"
                className="font-yellowtail"
                transform="rotate(-8 110 65)"
              >
                charis.
              </text>
            </svg>
          </div>

          {/* Eyebrow M */}
          <p
            data-scroll-reveal="lines"
            className="font-playfair text-[2.5rem] max-[991px]:text-[1.6rem] max-[600px]:text-[1.15rem] leading-none tracking-[-0.03em] text-[#faf3e4]/80 transition-colors duration-700"
            style={{
              fontVariationSettings: "'wght' 500, 'wdth' 87.5, 'opsz' 40"
            }}
          >
            The curators behind the feelings
          </p>

          {/* Headline: Serif 'Meet', heavy 'the', serif 'curators' */}
          <h2
            data-scroll-reveal="chars"
            data-font-weight-hover
            data-wght-rest="700"
            data-wght-near="200"
            data-wght-radius="400"
            className="font-archivo uppercase text-[7rem] max-[991px]:text-[4.2rem] max-[600px]:text-[2.5rem] leading-[0.82em] tracking-[-0.02em] text-[#faf3e4] transition-colors duration-700 select-none"
            style={{ fontWeight: 700, fontStretch: '72%' }}
          >
            <span
              className="font-playfair italic font-normal tracking-[-0.035em] text-[#ef4a23] mr-[0.25em]"
              data-font-weight-hover
              data-wght-rest="300"
              data-wght-near="800"
              data-wght-radius="400"
              style={{
                fontVariationSettings: "'wght' 300, 'wdth' 87.5, 'opsz' 120"
              }}
            >
              MEET
            </span>
            <span className="text-[#faf3e4]">THE</span>{' '}
            <span
              className="font-playfair italic font-normal tracking-[-0.035em] text-[#ef4a23] ml-[0.25em]"
              data-font-weight-hover
              data-wght-rest="300"
              data-wght-near="800"
              data-wght-radius="400"
              style={{
                fontVariationSettings: "'wght' 300, 'wdth' 87.5, 'opsz' 120"
              }}
            >
              CURATORS
            </span>
          </h2>

          {/* Paragraph */}
          <p
            data-scroll-reveal="lines"
            className="font-playfair text-[1.25rem] max-[991px]:text-[1rem] max-[600px]:text-[0.85rem] leading-[1.35] tracking-[-0.01em] text-[#faf3e4]/70 max-w-[26rem] max-[600px]:max-w-[78vw] transition-colors duration-700"
            style={{
              fontVariationSettings: "'wght' 400, 'wdth' 100, 'opsz' 20"
            }}
          >
            Twelve curators, one emotional index. We scout, calibrate and personalize before the moment arrives.
          </p>
        </div>
      </div>

      {/* Photo Layer (z-index 2, rising past and sliding over title) */}
      <div className="absolute inset-0 w-full h-full z-[2] pointer-events-none">
        {PHOTOS.map((photo, index) => (
          <div
            key={index}
            data-speed={photo.speed}
            className={`team-photo-card absolute pointer-events-auto rounded-[0.5rem] shadow-[0_20px_45px_rgba(0,0,0,0.35)] cursor-grab active:cursor-grabbing select-none max-[600px]:!w-[clamp(6rem,24vw,8rem)]
              ${photo.side === 'left' ? 'left-[var(--left-off)] max-[600px]:!left-[2vw]' : 'right-[var(--right-off)] max-[600px]:!right-[2vw]'}
            `}
            style={{
              top: photo.top,
              width: photo.width,
              aspectRatio: '4 / 5',
              backgroundColor: '#e9dcc6',
              transform: `rotate(${photo.rotate}deg)`,
              willChange: 'transform',
              ['--left-off' as any]: photo.side === 'left' ? photo.offset : undefined,
              ['--right-off' as any]: photo.side === 'right' ? photo.offset : undefined
            }}
          >
            {/* Cropped Image */}
            <div
              className="crop w-full h-full rounded-[0.5rem] overflow-hidden"
              data-crop={photo.crop}
            />

            {/* Sticker / Tag */}
            {photo.isBts ? (
              <div className="absolute bottom-[0.7rem] left-[0.7rem] bg-[#faf3e4] text-[#141110] font-archivo uppercase text-[0.9rem] px-[0.5rem] py-[0.25rem] rounded-[0.2rem] shadow-sm tracking-[-0.01em]">
                {photo.label}
              </div>
            ) : (
              <div
                className="absolute -bottom-[0.9rem] left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
                style={{
                  transform: `translateX(-50%) rotate(${photo.labelRotate || 0}deg)`
                }}
              >
                <span
                  className="font-titan text-[3.4rem] max-[600px]:text-[1.9rem] text-[#ef4a23]"
                  style={{
                    WebkitTextStroke: '0.32rem #faf3e4',
                    paintOrder: 'stroke fill',
                    display: 'inline-block'
                  }}
                >
                  {photo.label}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
