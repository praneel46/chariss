import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    id: 1,
    title: 'CHRONO SCULPT',
    subtitle: 'Swiss Automatic Horology',
    frameColor: '#ef4a23',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=85'
  },
  {
    id: 2,
    title: 'AMBER & IRIS',
    subtitle: 'Niche Extrait de Parfum',
    frameColor: '#8fc6e8',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1600&q=85'
  },
  {
    id: 3,
    title: 'SOLAR TITANIUM',
    subtitle: 'Handcrafted Aviator Eyewear',
    frameColor: '#ffd46e',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1600&q=85'
  },
  {
    id: 4,
    title: 'TITANIUM HALO',
    subtitle: 'Biometric Health Ring',
    frameColor: '#b9c48a',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85'
  },
  {
    id: 5,
    title: 'ATELIER TOTE',
    subtitle: 'Full-Grain Tuscan Leather',
    frameColor: '#f6a9c2',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1600&q=85'
  }
];

export const DropsStackKolibrie: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stackRootRef = useRef<HTMLDivElement>(null);
  const badgeSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const section = sectionRef.current;
    const pin = pinRef.current;
    const stackRoot = stackRootRef.current;
    const badgeSvg = badgeSvgRef.current;
    if (!section || !pin || !stackRoot || !gsap) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!ScrollTrigger) return;

    const isDesktop = window.innerWidth >= 992;
    const dropDist = isDesktop ? window.innerHeight * 0.9 : window.innerHeight * 0.7;
    const zStep = isDesktop ? 120 : 65;
    const yStep = isDesktop ? 40 : 22;

    const slideEls = stackRoot.querySelectorAll<HTMLElement>('.slide-card');
    const count = slideEls.length;
    if (count === 0) return;

    // Set initial 3D positions
    slideEls.forEach((slide, b) => {
      gsap.set(slide, {
        z: -b * zStep,
        y: -b * yStep,
        zIndex: count - b,
        autoAlpha: 1
      });
    });

    // Paused Master Timeline for Peel-away 3D stack
    const tl = gsap.timeline({ paused: true });

    for (let b = 0; b < count - 1; b++) {
      const currentSlide = slideEls[b];

      // Current slide drops forward and fades out
      tl.to(
        currentSlide,
        {
          y: () => `+=${dropDist}`,
          duration: 1,
          ease: 'power2.in'
        },
        b
      );
      tl.to(
        currentSlide,
        {
          autoAlpha: 0,
          duration: 0.25,
          ease: 'none'
        },
        b + 0.7
      );

      // All remaining slides behind step forward
      for (let j = b + 1; j < count; j++) {
        const nextSlide = slideEls[j];
        const newIndex = j - (b + 1);
        tl.to(
          nextSlide,
          {
            z: -newIndex * zStep,
            y: -newIndex * yStep,
            duration: 1,
            ease: 'none'
          },
          b
        );
      }
    }

    // Badge spins 180° across entire duration (count - 1 = 4)
    if (badgeSvg) {
      tl.to(
        badgeSvg,
        {
          rotation: 180,
          duration: count - 1,
          ease: 'none'
        },
        0
      );
    }

    // Pinned ScrollTrigger for entire peel sequence on both desktop & mobile
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * (isDesktop ? 1.2 : 0.95) * (count - 1)}`,
      pin: pin,
      pinSpacing: true,
      scrub: 0.3,
      refreshPriority: 1,
      invalidateOnRefresh: true,
      onUpdate: (self: any) => {
        tl.progress(self.progress);
      }
    });

    // Mouse & Touch tilt on stage root
    let quickTiltX: any = null;
    let quickTiltY: any = null;
    if (!isReducedMotion) {
      quickTiltX = gsap.quickTo(stackRoot, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      quickTiltY = gsap.quickTo(stackRoot, 'rotationY', { duration: 0.6, ease: 'power3.out' });

      const onMouseMove = (e: MouseEvent) => {
        const rect = pin.getBoundingClientRect();
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        quickTiltX(-normY * 6);
        quickTiltY(normX * 10);
      };

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches && e.touches[0]) {
          const rect = pin.getBoundingClientRect();
          const normY = (e.touches[0].clientY - rect.top) / rect.height - 0.5;
          const normX = (e.touches[0].clientX - rect.left) / rect.width - 0.5;
          quickTiltX(-normY * 4);
          quickTiltY(normX * 8);
        }
      };

      const onMouseLeave = () => {
        quickTiltX(0);
        quickTiltY(0);
      };

      pin.addEventListener('mousemove', onMouseMove);
      pin.addEventListener('mouseleave', onMouseLeave);
      pin.addEventListener('touchmove', onTouchMove, { passive: true });
      pin.addEventListener('touchend', onMouseLeave);

      return () => {
        st.kill();
        tl.kill();
        pin.removeEventListener('mousemove', onMouseMove);
        pin.removeEventListener('mouseleave', onMouseLeave);
        pin.removeEventListener('touchmove', onTouchMove);
        pin.removeEventListener('touchend', onMouseLeave);
      };
    }

    return () => {
      st.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="drops"
      data-featured-stack
      className="relative w-full bg-[#faf3e4] text-[#141110]"
    >
      <div
        ref={pinRef}
        className="w-full h-screen max-h-[100dvh] grid grid-cols-[38fr_62fr] max-[991px]:flex max-[991px]:flex-col max-[991px]:justify-between gap-[2rem] max-[991px]:gap-[0.5rem] px-[5rem] pr-[3rem] max-[991px]:px-[1.25rem] max-[991px]:pt-[5.5rem] max-[991px]:pb-[2rem] items-center overflow-hidden relative"
      >
        {/* Left Column / Top Section on Mobile (Copy) */}
        <div className="flex flex-col gap-[1.5rem] max-[991px]:gap-[0.4rem] justify-center z-10 max-w-[28rem] max-[991px]:max-w-full max-[991px]:text-center">
          <p
            data-scroll-reveal="lines"
            className="font-playfair text-[2rem] max-[991px]:text-[1.15rem] max-[600px]:text-[0.95rem] leading-tight tracking-[-0.03em] text-[#141110]/80"
            style={{
              fontVariationSettings: "'wght' 500, 'wdth' 87.5, 'opsz' 40"
            }}
          >
            All feelings, zero guesswork. A handful of what left our atelier desk lately.
          </p>

          <h2
            data-scroll-reveal="chars"
            data-font-weight-hover
            data-wght-rest="700"
            data-wght-near="200"
            data-wght-radius="400"
            className="font-archivo uppercase text-[8rem] max-[991px]:text-[3.8rem] max-[600px]:text-[2.8rem] leading-[0.8em] tracking-[-0.02em] text-[#141110] select-none"
            style={{ fontWeight: 700, fontStretch: '72%' }}
          >
            <span className="inline max-[991px]:inline-block mr-[0.2em] max-[991px]:mr-[0.3em]">LATEST</span>
            <span
              className="font-playfair italic font-normal tracking-[-0.035em] text-[#ef4a23] inline max-[991px]:inline-block mt-[0.05em]"
              data-font-weight-hover
              data-wght-rest="300"
              data-wght-near="800"
              data-wght-radius="400"
              style={{
                fontVariationSettings: "'wght' 300, 'wdth' 87.5, 'opsz' 120"
              }}
            >
              DROPS
            </span>
          </h2>
        </div>

        {/* Right Column / Stage Area with 3D Card Stack (Preserved on both Mobile & Desktop) */}
        <div
          className="relative h-full max-[991px]:flex-1 w-full flex items-center justify-center max-[991px]:min-h-[280px]"
          style={{ perspective: '1400px' }}
        >
          <div
            ref={stackRootRef}
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform'
            }}
          >
            {SLIDES.map((slide) => (
              <Link
                key={slide.id}
                to="/consultation"
                data-cursor-marquee-text="View gift →"
                className="slide-card absolute aspect-[1.75] max-[991px]:aspect-[1.48] w-[min(80vh,52vw)] max-[991px]:w-[min(90vw,360px)] left-1/2 top-[calc(50%-5vh)] max-[991px]:top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[0.5rem] shadow-[0_20px_50px_rgba(20,17,16,0.15)] overflow-hidden cursor-pointer block select-none group"
                style={{
                  backgroundColor: slide.frameColor,
                  padding: '1.75vh'
                }}
              >
                {/* Real Luxury Photo / Crop Box */}
                {slide.image ? (
                  <div className="w-full h-full rounded-[0.25rem] overflow-hidden relative">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                ) : (
                  <div
                    className="crop w-full h-full rounded-[0.25rem] overflow-hidden relative"
                    data-crop={(slide as any).crop}
                  />
                )}

                {/* Bottom Shadow Gradient */}
                <div
                  className="absolute inset-[1.75vh] rounded-[0.25rem] pointer-events-none"
                  style={{
                    background: 'linear-gradient(rgba(0,0,0,0) 45%, rgba(0,0,0,0.75))'
                  }}
                />

                {/* Slide Title & Subtitle */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pointer-events-none pb-[2.4em] max-[991px]:pb-[1.2em] gap-1">
                  <span
                    className="font-archivo uppercase text-[7.5vh] max-[991px]:text-[2.2rem] max-[600px]:text-[1.8rem] leading-[0.85] tracking-[-0.02em] text-[#faf3e4] text-center px-4"
                    style={{
                      fontWeight: 800,
                      fontStretch: '72%',
                      textShadow: '0 0.05em 0.3em rgba(0,0,0,0.45)'
                    }}
                  >
                    {slide.title}
                  </span>
                  <span className="font-playfair text-[#faf3e4]/80 text-[1.4rem] max-[991px]:text-[1.05rem] max-[600px]:text-[0.9rem] tracking-wide italic">
                    {slide.subtitle}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Badge (Spinning 180° with sun on both Desktop & Mobile) */}
          <div className="absolute bottom-[1rem] right-[1rem] max-[991px]:bottom-[0.5rem] max-[991px]:right-[0.5rem] w-[9rem] h-[9rem] max-[991px]:w-[4.2rem] max-[991px]:h-[4.2rem] z-[5] pointer-events-none">
            <svg
              ref={badgeSvgRef}
              viewBox="0 0 200 200"
              className="w-full h-full drop-shadow-md"
              style={{ willChange: 'transform' }}
            >
              <defs>
                <path
                  id="badgePath"
                  d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
                />
              </defs>
              <circle cx="100" cy="100" r="98" fill="#ef4a23" />
              <text
                fill="#faf3e4"
                fontSize="24"
                className="font-archivo uppercase"
                style={{
                  fontWeight: 800,
                  fontStretch: '80%'
                }}
              >
                <textPath
                  href="#badgePath"
                  textLength="436"
                  lengthAdjust="spacing"
                >
                  SCROLL · CHERISH · SELECT · REPEAT ·
                </textPath>
              </text>
              {/* Sun in centre */}
              <circle cx="100" cy="100" r="17" fill="none" stroke="#faf3e4" strokeWidth="5" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line
                  key={angle}
                  x1="100"
                  y1="72"
                  x2="100"
                  y2="62"
                  stroke="#faf3e4"
                  strokeWidth="5"
                  strokeLinecap="round"
                  transform={`rotate(${angle} 100 100)`}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
