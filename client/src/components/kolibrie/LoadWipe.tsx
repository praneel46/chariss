import React, { useEffect, useRef } from 'react';

interface LoadWipeProps {
  onReady?: () => void;
}

export const LoadWipe: React.FC<LoadWipeProps> = ({ onReady }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const gsap = window.gsap;
    const overlay = overlayRef.current;
    const path = pathRef.current;
    if (!overlay || !path) return;

    let hasExecuted = false;

    const revealEverything = () => {
      if (hasExecuted) return;
      hasExecuted = true;
      document.documentElement.setAttribute('data-page-ready', 'true');
      overlay.setAttribute('data-transition-ready', 'true');
      overlay.style.display = 'none';
      const main = document.querySelector('main');
      if (main) {
        main.style.visibility = 'visible';
        main.style.opacity = '1';
      }
      onReady?.();
    };

    // 4-second failsafe: if not marked ready by 4 seconds, reveal everything immediately!
    const failsafeTimer = setTimeout(() => {
      revealEverything();
    }, 4000);

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion || !gsap) {
      clearTimeout(failsafeTimer);
      revealEverything();
      return;
    }

    const startLoad = () => {
      document.documentElement.setAttribute('data-page-ready', 'true');
      const main = document.querySelector('main');

      const tl = gsap.timeline({
        onComplete: () => {
          clearTimeout(failsafeTimer);
          overlay.setAttribute('data-transition-ready', 'true');
          overlay.style.display = 'none';
        }
      });

      // 0s: main autoAlpha 0, path thick tomato scribble covers screen
      if (main) gsap.set(main, { autoAlpha: 0 });
      gsap.set(path, { drawSVG: '0% 100%', strokeWidth: '35%' });

      // 0.4s reveal: main becomes visible, page init runs
      tl.addLabel('reveal', 0.4);
      tl.to(main, { autoAlpha: 1, duration: 0.1 }, 'reveal');
      tl.call(() => {
        onReady?.();
      }, undefined, 'reveal');

      // Unwind scribble off screen over 1.25s power1.inOut
      tl.to(
        path,
        {
          drawSVG: '100% 100%',
          strokeWidth: '5%',
          duration: 1.25,
          ease: 'power1.inOut'
        },
        'reveal'
      );
    };

    // Start when fonts ready or after 1.5s
    const fontTimeout = setTimeout(() => {
      if (!hasExecuted) startLoad();
    }, 1500);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        clearTimeout(fontTimeout);
        if (!hasExecuted) startLoad();
      });
    } else {
      startLoad();
    }

    return () => {
      clearTimeout(failsafeTimer);
      clearTimeout(fontTimeout);
    };
  }, [onReady]);

  return (
    <div
      ref={overlayRef}
      id="load-wipe-overlay"
      className="fixed inset-0 z-[1000] pointer-events-none overflow-hidden"
      style={{ display: 'block' }}
    >
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="w-full h-full block"
      >
        <path
          ref={pathRef}
          d="M43 259C296 11.5688 994 -3 922.994 498.259C851.988 999.517 281.229 1004.28 123 767C-35.2287 529.721 179 259 472 259C765 259 792 498.259 659 654C526 809.741 319 755 285 669.001C251 583.001 299 452 496 452C693 452 876.073 639.171 935 937.001"
          fill="none"
          stroke="#ef4a23"
          strokeWidth="0"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
