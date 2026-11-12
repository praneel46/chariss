// Font weight follows cursor engine (section 6.6)
interface CharData {
  el: HTMLElement;
  rest: number;
  near: number;
  radius: number;
  x: number;
  y: number;
  currentWght: number;
  quickTo: (val: number) => void;
}

export function initFontWeightHover() {
  const gsap = window.gsap;
  if (!gsap) return () => {};

  // Check prefers-reduced-motion or touch devices
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none), (pointer: coarse)').matches) {
    return () => {};
  }

  const headlines = document.querySelectorAll<HTMLElement>('[data-font-weight-hover]');
  if (!headlines.length) return () => {};

  const charsList: CharData[] = [];
  let mouseX = -9999;
  let mouseY = -9999;
  let lastScrollY = window.scrollY;

  headlines.forEach(headline => {
    // If not already split into .char elements, split them
    let chars = headline.querySelectorAll<HTMLElement>('.char');
    if (!chars.length) {
      if (window.SplitText) {
        new window.SplitText(headline, {
          type: 'chars,words',
          charsClass: 'char',
          autoSplit: false
        });
        chars = headline.querySelectorAll<HTMLElement>('.char');
      } else {
        // Fallback split if SplitText not present
        const text = headline.textContent || '';
        headline.innerHTML = '';
        for (const ch of text) {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = ch;
          headline.appendChild(span);
        }
        chars = headline.querySelectorAll<HTMLElement>('.char');
      }
    }

    chars.forEach(charEl => {
      const parentWithConfig = charEl.closest<HTMLElement>('[data-font-weight-hover]') || headline;
      const rest = parseFloat(parentWithConfig.getAttribute('data-wght-rest') || '700');
      const near = parseFloat(parentWithConfig.getAttribute('data-wght-near') || '200');
      const radius = parseFloat(parentWithConfig.getAttribute('data-wght-radius') || '400');

      charEl.style.setProperty('--wght', String(rest));

      // Retain existing variation settings (wdth, opsz) while setting wght to var(--wght)
      const isSerif = parentWithConfig.classList.contains('font-playfair') || charEl.closest('.font-playfair');
      if (isSerif) {
        charEl.style.fontVariationSettings = "'wght' var(--wght), 'wdth' 87.5, 'opsz' 120";
      } else {
        charEl.style.fontVariationSettings = "'wght' var(--wght), 'wdth' 72";
      }

      const qTo = gsap.quickTo(charEl, '--wght', { duration: 0.4, ease: 'power2.out' });

      charsList.push({
        el: charEl,
        rest,
        near,
        radius,
        x: 0,
        y: 0,
        currentWght: rest,
        quickTo: qTo
      });
    });
  });

  const updatePositions = () => {
    charsList.forEach(item => {
      const rect = item.el.getBoundingClientRect();
      item.x = rect.left + rect.width / 2 + window.scrollX;
      item.y = rect.top + rect.height / 2 + window.scrollY;
    });
  };

  updatePositions();

  const onMouseMove = (e: MouseEvent) => {
    mouseX = e.pageX;
    mouseY = e.pageY;
  };

  const onScroll = () => {
    const deltaY = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    mouseY += deltaY;
    updatePositions();
  };

  const onResize = () => {
    updatePositions();
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  const tickerCallback = () => {
    if (mouseX === -9999) return;
    for (let i = 0; i < charsList.length; i++) {
      const item = charsList[i];
      const dx = mouseX - item.x;
      const dy = mouseY - item.y;
      const dist = Math.hypot(dx, dy);

      let target: number;
      if (dist >= item.radius) {
        target = item.rest;
      } else {
        const factor = 1 - dist / item.radius;
        target = item.rest + (item.near - item.rest) * factor;
      }

      // Clamp between min and max
      const minW = Math.min(item.rest, item.near);
      const maxW = Math.max(item.rest, item.near);
      target = Math.max(minW, Math.min(maxW, target));

      if (Math.abs(target - item.currentWght) >= 1) {
        item.currentWght = target;
        item.quickTo(target);
      }
    }
  };

  gsap.ticker.add(tickerCallback);

  return () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    gsap.ticker.remove(tickerCallback);
  };
}
