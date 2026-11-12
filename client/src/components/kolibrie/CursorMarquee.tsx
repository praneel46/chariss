import React, { useEffect, useRef } from 'react';

export const CursorMarquee: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const span1Ref = useRef<HTMLSpanElement>(null);
  const span2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const gsap = window.gsap;
    const wrapper = wrapperRef.current;
    const span1 = span1Ref.current;
    const span2 = span2Ref.current;
    if (!wrapper || !span1 || !span2 || !gsap) return;

    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
      return;
    }

    let isFirstMove = true;
    let pauseTimer: any = null;

    const quickX = gsap.quickTo(wrapper, 'x', { duration: 0.4, ease: 'power3.out' });
    const quickY = gsap.quickTo(wrapper, 'y', { duration: 0.4, ease: 'power3.out' });

    const handlePointer = (clientX: number, clientY: number) => {
      if (isFirstMove) {
        gsap.set(wrapper, { x: clientX, y: clientY });
        isFirstMove = false;
      } else {
        quickX(clientX);
        quickY(clientY);
      }

      const target = document.elementFromPoint(clientX, clientY);
      const marqueeTarget = target?.closest<HTMLElement>('[data-cursor-marquee-text]');

      if (marqueeTarget) {
        const text = marqueeTarget.getAttribute('data-cursor-marquee-text') || 'View case →';
        span1.textContent = text;
        span2.textContent = text;

        const duration = Math.max(1.5, text.length / 5);
        span1.style.animationDuration = `${duration}s`;
        span2.style.animationDuration = `${duration}s`;
        span1.style.animationPlayState = 'running';
        span2.style.animationPlayState = 'running';

        if (pauseTimer) clearTimeout(pauseTimer);
        wrapper.setAttribute('data-cursor-marquee-status', 'active');
      } else {
        wrapper.removeAttribute('data-cursor-marquee-status');
        if (pauseTimer) clearTimeout(pauseTimer);
        pauseTimer = setTimeout(() => {
          span1.style.animationPlayState = 'paused';
          span2.style.animationPlayState = 'paused';
        }, 400);
      }
    };

    let lastX = 0;
    let lastY = 0;

    const onPointerMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      handlePointer(e.clientX, e.clientY);
    };

    const onScroll = () => {
      if (!isFirstMove) {
        handlePointer(lastX, lastY);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      id="cursor-marquee-wrapper"
      className="fixed top-0 left-0 z-[100] pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{ willChange: 'transform' }}
    >
      <div
        className="cursor-marquee-card w-[9.5rem] bg-[#ffd46e] text-[#141110] overflow-hidden rounded-[0.25rem] shadow-lg flex items-center relative h-[2.4rem] transition-transform duration-400 ease-[cubic-bezier(0.65,0.05,0,1)] scale-0 data-[cursor-marquee-status=active]:scale-100"
        style={{
          transform: 'scale(var(--scale, 0))',
          transformOrigin: 'center center'
        }}
      >
        <span
          ref={span1Ref}
          className="animate-marquee-text font-archivo uppercase text-[1.1rem] leading-none whitespace-nowrap px-[0.25em] py-[0.375em]"
          style={{
            fontWeight: 800,
            fontStretch: '72%',
            animationPlayState: 'paused',
            display: 'inline-block'
          }}
        >
          View gift →
        </span>
        <span
          ref={span2Ref}
          className="animate-marquee-text font-archivo uppercase text-[1.1rem] leading-none whitespace-nowrap px-[0.25em] py-[0.375em] absolute left-full"
          style={{
            fontWeight: 800,
            fontStretch: '72%',
            animationPlayState: 'paused',
            display: 'inline-block'
          }}
        >
          View gift →
        </span>
      </div>
      <style>{`
        #cursor-marquee-wrapper[data-cursor-marquee-status="active"] .cursor-marquee-card {
          --scale: 1;
        }
      `}</style>
    </div>
  );
};
