import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261110_231342_88260d66-aa30-4612-9157-d7f1b5a66d8c.mp4';
const HERO_POSTER = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261110_224241_f6feccd5-1c45-4d22-b369-f927916f9973.png&w=2048&q=85';

export const HeroKolibrie: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const marqueeWrapperRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gsap = window.gsap;
    const hero = heroRef.current;
    const video = videoRef.current;
    const card = cardRef.current;
    const media = mediaRef.current;
    const h1 = h1Ref.current;
    if (!hero || !gsap) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Video vs Reduced Motion Still
    if (video) {
      if (isReducedMotion) {
        video.removeAttribute('src');
      } else {
        video.src = HERO_VIDEO;
        video.play().catch(() => {});
      }
    }

    // --- 1. Headline SplitText & Reveal ---
    if (h1 && !isReducedMotion) {
      if (window.SplitText) {
        const split = new window.SplitText(h1, {
          type: 'chars,words,lines',
          linesClass: 'line',
          charsClass: 'char',
          mask: 'lines',
          autoSplit: false
        });
        gsap.from(split.chars, {
          yPercent: 135,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.0175,
          delay: 0.6,
          onComplete: () => {
            document.dispatchEvent(new CustomEvent('reveal:done'));
          }
        });
      }
    }

    // --- 2. Interactive Follower Card (Desktop Mouse & Mobile Touch) ---
    if (card && media && !isReducedMotion) {
      const quickX = gsap.quickTo(card, 'x', { duration: 0.8, ease: 'power4.out' });
      const quickY = gsap.quickTo(card, 'y', { duration: 0.8, ease: 'power4.out' });
      const quickRot = gsap.quickTo(card, 'rotation', { duration: 0.8, ease: 'power4.out' });
      const quickDriftX = gsap.quickTo(media, 'xPercent', { duration: 0.6, ease: 'power2.out' });
      const quickDriftY = gsap.quickTo(media, 'yPercent', { duration: 0.7, ease: 'power2.out' });

      let isFirstMove = true;
      let lastX = 0;
      let lastY = 0;
      let travelCounter = 0;
      let currentPhotoIdx = 0;
      let settleTimer: any = null;
      let isVisible = false;

      const photoCrops = media.querySelectorAll<HTMLElement>('.crop');
      if (photoCrops.length > 0) {
        photoCrops[0].classList.add('on');
      }

      // Initial state: subtle presentation
      gsap.set(card, { autoAlpha: window.innerWidth < 992 ? 0.85 : 0 });

      const handlePointerCoord = (clientX: number, clientY: number) => {
        const heroRect = hero.getBoundingClientRect();
        if (
          clientX < heroRect.left ||
          clientX > heroRect.right ||
          clientY < heroRect.top ||
          clientY > heroRect.bottom
        ) {
          if (isVisible && window.innerWidth >= 992) {
            gsap.to(card, { autoAlpha: 0, duration: 0.3 });
            isVisible = false;
          }
          return;
        }

        const target = document.elementFromPoint(clientX, clientY);
        const isOverInteractive = target?.closest('a, button, input, textarea');

        if (isOverInteractive) {
          if (isVisible) {
            gsap.to(card, { autoAlpha: 0, duration: 0.25, ease: 'power2.out' });
            isVisible = false;
          }
          return;
        }

        if (!isVisible) {
          gsap.to(card, { autoAlpha: 1, duration: 0.3 });
          isVisible = true;
        }

        const currentX = clientX - window.innerWidth / 2;
        const currentY = clientY - window.innerHeight / 2 - heroRect.top;

        if (isFirstMove) {
          gsap.set(card, { x: currentX, y: currentY });
          lastX = currentX;
          lastY = currentY;
          isFirstMove = false;
          return;
        }

        const dx = (currentX - lastX) / 2;
        const dy = (currentY - lastY) / 2;
        const rot = (currentX - lastX) / 4;

        quickX(currentX);
        quickY(currentY);
        quickRot(rot);

        const clampX = Math.max(-8, Math.min(8, dx));
        const clampY = Math.max(-8, Math.min(8, dy));
        quickDriftX(-clampX);
        quickDriftY(-clampY);

        travelCounter += Math.abs(dx) + Math.abs(dy);
        if (travelCounter >= 250) {
          travelCounter = 0;
          if (photoCrops.length > 0) {
            photoCrops[currentPhotoIdx].classList.remove('on');
            currentPhotoIdx = (currentPhotoIdx + 1) % photoCrops.length;
            photoCrops[currentPhotoIdx].classList.add('on');
          }
        }

        lastX = currentX;
        lastY = currentY;

        if (settleTimer) clearTimeout(settleTimer);
        settleTimer = setTimeout(() => {
          quickRot(0);
          quickDriftX(0);
          quickDriftY(0);
        }, 66);
      };

      const onMouseMove = (e: MouseEvent) => {
        handlePointerCoord(e.clientX, e.clientY);
      };

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches && e.touches[0]) {
          handlePointerCoord(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      const onMouseLeave = () => {
        if (window.innerWidth >= 992) {
          gsap.to(card, {
            autoAlpha: 0,
            duration: 0.3,
            onComplete: () => {
              quickRot(0);
              quickDriftX(0);
              quickDriftY(0);
              isFirstMove = true;
              isVisible = false;
            }
          });
        }
      };

      hero.addEventListener('mousemove', onMouseMove);
      hero.addEventListener('mouseleave', onMouseLeave);
      hero.addEventListener('touchstart', onTouchMove, { passive: true });
      hero.addEventListener('touchmove', onTouchMove, { passive: true });

      return () => {
        hero.removeEventListener('mousemove', onMouseMove);
        hero.removeEventListener('mouseleave', onMouseLeave);
        hero.removeEventListener('touchstart', onTouchMove);
        hero.removeEventListener('touchmove', onTouchMove);
        if (settleTimer) clearTimeout(settleTimer);
      };
    }

    // --- 3. Client Marquee with Scroll Direction Flip ---
    if (marqueeWrapperRef.current && marqueeTrackRef.current) {
      const wrapper = marqueeWrapperRef.current;
      const track = marqueeTrackRef.current;

      const f = window.innerWidth >= 992 ? 1 : window.innerWidth >= 480 ? 0.5 : 0.25;
      const loopDuration = 30 * f;

      const marqueeTween = gsap.to(track, {
        xPercent: -50,
        duration: loopDuration,
        repeat: -1,
        ease: 'none'
      });

      if (window.ScrollTrigger) {
        // Flip timeScale based on scroll direction
        window.ScrollTrigger.create({
          trigger: hero,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self: any) => {
            marqueeTween.timeScale(self.direction === 1 ? -1 : 1);
          }
        });

        // Scrubbed shift from +10vw to -10vw
        gsap.fromTo(
          wrapper,
          { x: '10vw' },
          {
            x: '-10vw',
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0
            }
          }
        );
      }
    }
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      data-cursor-cards
      data-threshold="300"
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#faf3e4]"
    >
      {/* Background Video / Still Plate */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <video
          ref={videoRef}
          poster={HERO_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="w-full h-full object-cover object-[center_50%] max-[600px]:object-[6%_50%]"
        />
        {/* Subtle warm wash over video */}
        <div className="absolute inset-0 bg-[#faf3e4]/15" />
      </div>

      {/* Hero Cursor Card (Behind text, z-index 1) */}
      <div
        ref={cardRef}
        id="hero-cursor-card"
        className="absolute top-1/2 left-1/2 z-[1] pointer-events-none -translate-x-1/2 -translate-y-1/2 w-[16rem] h-[16rem] max-[600px]:w-[9.5rem] max-[600px]:h-[9.5rem] overflow-hidden rounded-[0.5rem] shadow-[0_24px_48px_rgba(20,17,16,0.18)]"
        style={{ willChange: 'transform, opacity' }}
      >
        <div
          ref={mediaRef}
          className="w-full h-full relative scale-[1.2] origin-center"
          style={{ willChange: 'transform' }}
        >
          {/* 8 Curated Luxury Gift / Editorial Photos from sheets */}
          <div className="crop absolute inset-0 opacity-0 [&.on]:opacity-100 transition-opacity duration-300" data-crop="work2:1" />
          <div className="crop absolute inset-0 opacity-0 [&.on]:opacity-100 transition-opacity duration-300" data-crop="work1:0" />
          <div className="crop absolute inset-0 opacity-0 [&.on]:opacity-100 transition-opacity duration-300" data-crop="work2:3" />
          <div className="crop absolute inset-0 opacity-0 [&.on]:opacity-100 transition-opacity duration-300" data-crop="work1:1" />
          <div className="crop absolute inset-0 opacity-0 [&.on]:opacity-100 transition-opacity duration-300" data-crop="work2:2" />
          <div className="crop absolute inset-0 opacity-0 [&.on]:opacity-100 transition-opacity duration-300" data-crop="work1:2" />
          <div className="crop absolute inset-0 opacity-0 [&.on]:opacity-100 transition-opacity duration-300" data-crop="work2:0" />
          <div className="crop absolute inset-0 opacity-0 [&.on]:opacity-100 transition-opacity duration-300" data-crop="work1:3" />
        </div>
      </div>

      {/* Hero Content (z-index 2) */}
      <div className="relative z-[2] flex flex-col items-center text-center gap-[2rem] -mt-[3rem] max-[600px]:gap-[1.2rem] max-[600px]:mt-[2rem] px-[1rem] max-w-[96vw]">
        {/* Headline */}
        <h1
          ref={h1Ref}
          data-text-reveal="chars"
          data-font-weight-hover
          data-wght-rest="700"
          data-wght-near="200"
          data-wght-radius="400"
          className="font-archivo uppercase text-[clamp(2.4rem,8.5vw,9rem)] max-[600px]:text-[2.6rem] max-[600px]:leading-[0.88em] tracking-[-0.02em] leading-[0.8em] text-[#141110] select-none"
          style={{ fontWeight: 700, fontStretch: '72%' }}
        >
          <span className="block">FEELINGS THAT</span>
          <span className="block mt-[0.05em]">
            GET{' '}
            <span
              className="font-playfair italic font-normal tracking-[-0.035em] text-[#ef4a23]"
              data-font-weight-hover
              data-wght-rest="300"
              data-wght-near="800"
              data-wght-radius="400"
              style={{
                fontVariationSettings: "'wght' 300, 'wdth' 87.5, 'opsz' 120"
              }}
            >
              CHERISHED
            </span>
          </span>
        </h1>

        {/* Hero CTA Link with Always-on Drawn Underline & Sliding Arrow */}
        <Link
          to="/consultation"
          className="group relative inline-flex items-center gap-[0.375em] font-playfair text-[clamp(1.3rem,4.5vw,2.1rem)] tracking-[-0.03em] leading-none text-[#141110] mt-[0.5rem] hover:text-[#ef4a23] transition-colors"
          style={{
            fontVariationSettings: "'wght' 500, 'wdth' 87.5, 'opsz' 40"
          }}
        >
          <span className="relative">
            Start consultation
            <span
              data-draw-line="always"
              data-line-color="#ef4a23"
              className="absolute top-[118%] left-0 w-full h-[0.6em] pointer-events-none"
            />
          </span>

          {/* 1em tomato square with sliding white down-arrow */}
          <span className="w-[1em] h-[1em] rounded-[0.2em] bg-[#ef4a23] relative overflow-hidden inline-flex items-center justify-center shrink-0">
            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:translate-y-full">
              <svg viewBox="0 0 14 13" className="w-[60%] h-[60%] fill-white">
                <path d="M12.94 5.7 9.95 8 6.9 10.37l.84 1.86V0h-2.55v12.23l.85-1.86L3 8 0 5.7V9.05l6.47 4.95 6.47-4.95z" />
              </svg>
            </span>
            <span className="absolute inset-0 flex items-center justify-center -translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:translate-y-0">
              <svg viewBox="0 0 14 13" className="w-[60%] h-[60%] fill-white">
                <path d="M12.94 5.7 9.95 8 6.9 10.37l.84 1.86V0h-2.55v12.23l.85-1.86L3 8 0 5.7V9.05l6.47 4.95 6.47-4.95z" />
              </svg>
            </span>
          </span>
        </Link>
      </div>

      {/* Client Marquee (At bottom 1.5rem, full width, z-index 2) */}
      <div
        ref={marqueeWrapperRef}
        id="hero-client-marquee"
        className="absolute bottom-[1.5rem] left-0 w-[120%] -ml-[10%] z-[2] overflow-hidden pointer-events-none opacity-85"
      >
        <div
          ref={marqueeTrackRef}
          className="flex items-center w-max whitespace-nowrap"
        >
          {/* 2 Sets of 8 Abstract Tomato SVG Marks */}
          {[0, 1].map((copyIdx) => (
            <div key={copyIdx} className="flex items-center shrink-0">
              {/* Mark 1: Six-spoke asterisk */}
              <div className="w-[9rem] h-[7rem] mx-[2.5rem] max-[600px]:w-[5.5rem] max-[600px]:h-[5rem] max-[600px]:mx-[1rem] flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-[60%] h-[60%] stroke-[#ef4a23] stroke-[3.5] stroke-linecap-round">
                  <line x1="20" y1="4" x2="20" y2="36" />
                  <line x1="6" y1="12" x2="34" y2="28" />
                  <line x1="6" y1="28" x2="34" y2="12" />
                </svg>
              </div>

              {/* Mark 2: Two capsule D shapes */}
              <div className="w-[9rem] h-[7rem] mx-[2.5rem] max-[600px]:w-[5.5rem] max-[600px]:h-[5rem] max-[600px]:mx-[1rem] flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-[60%] h-[60%] stroke-[#ef4a23] stroke-[3.5] fill-none">
                  <path d="M6 10h8a10 10 0 0 1 10 10 10 10 0 0 1-10 10H6z" />
                  <path d="M22 10h8a10 10 0 0 1 10 10 10 10 0 0 1-10 10h-8z" />
                </svg>
              </div>

              {/* Mark 3: Three wavy lines */}
              <div className="w-[9rem] h-[7rem] mx-[2.5rem] max-[600px]:w-[5.5rem] max-[600px]:h-[5rem] max-[600px]:mx-[1rem] flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-[60%] h-[60%] stroke-[#ef4a23] stroke-[3.5] stroke-linecap-round fill-none">
                  <path d="M6 12c4-4 8 4 12 0s8-4 12 0 4 4 4 0" />
                  <path d="M6 20c4-4 8 4 12 0s8-4 12 0 4 4 4 0" />
                  <path d="M6 28c4-4 8 4 12 0s8-4 12 0 4 4 4 0" />
                </svg>
              </div>

              {/* Mark 4: Four diamonds */}
              <div className="w-[9rem] h-[7rem] mx-[2.5rem] max-[600px]:w-[5.5rem] max-[600px]:h-[5rem] max-[600px]:mx-[1rem] flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-[60%] h-[60%] fill-[#ef4a23]">
                  <polygon points="20,4 26,12 20,20 14,12" />
                  <polygon points="20,20 26,28 20,36 14,28" />
                  <polygon points="12,12 18,20 12,28 6,20" />
                  <polygon points="28,12 34,20 28,28 22,20" />
                </svg>
              </div>

              {/* Mark 5: Half sun over three bars */}
              <div className="w-[9rem] h-[7rem] mx-[2.5rem] max-[600px]:w-[5.5rem] max-[600px]:h-[5rem] max-[600px]:mx-[1rem] flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-[60%] h-[60%] stroke-[#ef4a23] stroke-[3.5] stroke-linecap-round fill-none">
                  <path d="M10 20a10 10 0 0 1 20 0" />
                  <line x1="6" y1="26" x2="34" y2="26" />
                  <line x1="10" y1="31" x2="30" y2="31" />
                  <line x1="14" y1="36" x2="26" y2="36" />
                </svg>
              </div>

              {/* Mark 6: Two arches */}
              <div className="w-[9rem] h-[7rem] mx-[2.5rem] max-[600px]:w-[5.5rem] max-[600px]:h-[5rem] max-[600px]:mx-[1rem] flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-[60%] h-[60%] stroke-[#ef4a23] stroke-[3.5] stroke-linecap-round fill-none">
                  <path d="M6 34V18a14 14 0 0 1 28 0v16" />
                  <path d="M14 34V22a6 6 0 0 1 12 0v12" />
                </svg>
              </div>

              {/* Mark 7: Four-point sparkle star */}
              <div className="w-[9rem] h-[7rem] mx-[2.5rem] max-[600px]:w-[5.5rem] max-[600px]:h-[5rem] max-[600px]:mx-[1rem] flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-[60%] h-[60%] fill-[#ef4a23]">
                  <path d="M20 4 C20 14 22 18 36 20 C22 22 20 26 20 36 C20 26 18 22 4 20 C18 18 20 14 20 4 Z" />
                </svg>
              </div>

              {/* Mark 8: Circle with cross inside */}
              <div className="w-[9rem] h-[7rem] mx-[2.5rem] max-[600px]:w-[5.5rem] max-[600px]:h-[5rem] max-[600px]:mx-[1rem] flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-[60%] h-[60%] stroke-[#ef4a23] stroke-[3.5] stroke-linecap-round fill-none">
                  <circle cx="20" cy="20" r="14" />
                  <line x1="20" y1="10" x2="20" y2="30" />
                  <line x1="10" y1="20" x2="30" y2="20" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
