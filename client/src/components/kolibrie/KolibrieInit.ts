import { initCrops } from './CropSheet';
import { initDrawUnderlines } from './DrawUnderline';
import { initFontWeightHover } from './FontWeightHover';

export function setupKolibrieEngine() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const SplitText = window.SplitText;
  const DrawSVGPlugin = window.DrawSVGPlugin;
  const InertiaPlugin = window.InertiaPlugin;
  const Lenis = window.Lenis;

  if (gsap) {
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    if (SplitText) gsap.registerPlugin(SplitText);
    if (DrawSVGPlugin) gsap.registerPlugin(DrawSVGPlugin);
    if (InertiaPlugin) gsap.registerPlugin(InertiaPlugin);
  }

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Lenis Smooth Scroll
  let lenisInstance: any = null;
  if (!isReducedMotion && Lenis && gsap) {
    try {
      lenisInstance = new Lenis({
        lerp: 0.165,
        wheelMultiplier: 1.25
      });
      (window as any).lenisInstance = lenisInstance;

      lenisInstance.on('scroll', () => {
        if (ScrollTrigger) ScrollTrigger.update();
      });

      const updateTicker = (time: number) => {
        lenisInstance.raf(time * 1000);
      };

      gsap.ticker.add(updateTicker);
      gsap.ticker.lagSmoothing(0);
    } catch (err) {
      console.warn('Lenis initialization skipped:', err);
    }
  }

  // 2. Initialize Crop Sheets
  initCrops(document);

  // 3. Initialize Organic Draw Underlines
  initDrawUnderlines(document);

  // 4. Initialize Font Weight Hover
  const cleanupFontHover = initFontWeightHover();

  // 5. Scroll Reveals
  if (gsap && ScrollTrigger && !isReducedMotion) {
    const scrollRevealEls = document.querySelectorAll<HTMLElement>('[data-scroll-reveal]');
    scrollRevealEls.forEach(el => {
      const mode = el.getAttribute('data-scroll-reveal');
      const hasFontWeight = el.hasAttribute('data-font-weight-hover');

      if (mode === 'chars' && SplitText) {
        const split = new SplitText(el, {
          type: 'chars,words,lines',
          linesClass: 'line',
          charsClass: 'char',
          mask: 'lines',
          autoSplit: !hasFontWeight
        });
        gsap.from(split.chars, {
          yPercent: 135,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.0175,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true
          }
        });
      } else if (mode === 'lines' && SplitText) {
        const split = new SplitText(el, {
          type: 'lines,words',
          linesClass: 'line',
          mask: 'lines',
          autoSplit: !hasFontWeight
        });
        gsap.from(split.lines, {
          yPercent: 135,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true
          }
        });
      } else if (mode === 'element') {
        gsap.fromTo(
          el,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true
            }
          }
        );
      }
    });
  }

  return () => {
    cleanupFontHover();
    if (lenisInstance) {
      lenisInstance.destroy();
    }
  };
}
