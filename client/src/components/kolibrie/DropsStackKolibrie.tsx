import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
  { id: 1, title: 'CHRONO SCULPT', frameColor: '#ef4a23', crop: 'work1:0' },
  { id: 2, title: 'NEURAL VISION', frameColor: '#8fc6e8', crop: 'work1:1' },
  { id: 3, title: 'DEEP BIOMETRIC', frameColor: '#ffd46e', crop: 'work1:2' },
  { id: 4, title: 'SONIC SOLACE', frameColor: '#b9c48a', crop: 'work1:3' },
  { id: 5, title: 'ATELIER LEATHER', frameColor: '#f6a9c2', crop: 'work2:0' }
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

    const isDesktop = window.innerWidth >= 992;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isDesktop || !ScrollTrigger) return;

    const slideEls = stackRoot.querySelectorAll<HTMLElement>('.slide-card');
    const count = slideEls.length;
    if (count === 0) return;

    // Set initial 3D positions
    slideEls.forEach((slide, b) => {
      gsap.set(slide, {
        z: -b * 120,
        y: -b * 40,
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
          y: () => `+=${window.innerHeight * 0.9}`,
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
            z: -newIndex * 120,
            y: -newIndex * 40,
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

    // Pinned ScrollTrigger for 4.8 screen heights (innerHeight * 1.2 * (count - 1))
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * 1.2 * (count - 1)}`,
      pin: pin,
      pinSpacing: true,
      scrub: 0.3,
      refreshPriority: 1,
      invalidateOnRefresh: true,
      onUpdate: (self: any) => {
        tl.progress(self.progress);
      }
    });

    // Mouse tilt on stage root
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

      const onMouseLeave = () => {
        quickTiltX(0);
        quickTiltY(0);
      };

      pin.addEventListener('mousemove', onMouseMove);
      pin.addEventListener('mouseleave', onMouseLeave);

      return () => {
        st.kill();
        tl.kill();
        pin.removeEventListener('mousemove', onMouseMove);
        pin.removeEventListener('mouseleave', onMouseLeave);
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
        className="w-full h-screen max-[991px]:h-auto grid grid-cols-[38fr_62fr] max-[991px]:grid-cols-1 gap-[2rem] px-[5rem] pr-[3rem] max-[991px]:px-[1.5rem] max-[991px]:py-[6rem] items-center overflow-hidden"
      >
        {/* Left Column (Copy) */}
        <div className="flex flex-col gap-[1.5rem] justify-center z-10 max-w-[28rem]">
          <p
            data-scroll-reveal="lines"
            className="font-playfair text-[2rem] max-[600px]:text-[1.5rem] leading-tight tracking-[-0.03em] text-[#141110]/80"
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
            className="font-archivo uppercase text-[8rem] max-[991px]:text-[6rem] max-[600px]:text-[4.2rem] leading-[0.8em] tracking-[-0.02em] text-[#141110] select-none"
            style={{ fontWeight: 700, fontStretch: '72%' }}
          >
            <span className="block">LATEST</span>
            <span
              className="font-playfair italic font-normal tracking-[-0.035em] text-[#ef4a23] block mt-[0.05em]"
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

        {/* Right Column (Stage with 3D Card Stack) */}
        <div
          className="relative h-full max-[991px]:h-auto w-full flex items-center justify-center"
          style={{ perspective: '1400px' }}
        >
          <div
            ref={stackRootRef}
            className="relative w-full h-full max-[991px]:flex max-[991px]:flex-col max-[991px]:gap-[1.5rem]"
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
                className="slide-card absolute max-[991px]:relative aspect-[1.75] w-[min(80vh,52vw)] max-[991px]:w-full left-1/2 max-[991px]:left-0 top-[calc(50%-5vh)] max-[991px]:top-0 -translate-x-1/2 max-[991px]:translate-x-0 -translate-y-1/2 max-[991px]:translate-y-0 rounded-[0.5rem] shadow-[0_20px_50px_rgba(20,17,16,0.15)] overflow-hidden cursor-pointer block select-none group"
                style={{
                  backgroundColor: slide.frameColor,
                  padding: '1.75vh'
                }}
              >
                {/* Photo Crop Box */}
                <div
                  className="crop w-full h-full rounded-[0.25rem] overflow-hidden relative"
                  data-crop={slide.crop}
                />

                {/* Bottom Shadow Gradient */}
                <div
                  className="absolute inset-[1.75vh] rounded-[0.25rem] pointer-events-none"
                  style={{
                    background: 'linear-gradient(rgba(0,0,0,0) 55%, rgba(0,0,0,0.65))'
                  }}
                />

                {/* Slide Title */}
                <div className="absolute inset-0 flex items-end justify-center pointer-events-none pb-[2.4em] max-[991px]:pb-[1.6em]">
                  <span
                    className="font-archivo uppercase text-[7.5vh] max-[991px]:text-[3.4rem] max-[600px]:text-[2rem] leading-[0.8] tracking-[-0.02em] text-[#faf3e4] text-center px-4"
                    style={{
                      fontWeight: 800,
                      fontStretch: '72%',
                      textShadow: '0 0.05em 0.3em rgba(0,0,0,0.35)'
                    }}
                  >
                    {slide.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Badge (Desktop only, spinning 180° with sun) */}
          <div className="hidden lg:block absolute bottom-[1rem] right-[1rem] w-[9rem] h-[9rem] z-[5] pointer-events-none">
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
