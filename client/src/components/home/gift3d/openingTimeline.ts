import gsap from 'gsap';
import type { GiftScene } from './giftScene';
import type { Sfx } from './sfx';

/**
 * Master sequence (≈7.7s): anticipation → ribbon untie → lid + glow → camera dive → golden flood → current page reveal.
 * One GSAP timeline, so Skip / Escape / Replay can simply kill it.
 */
export function buildOpeningTimeline(scene: GiftScene, onDone: () => void, sfx?: Sfx) {
  const m = gsap.timeline({ onComplete: onDone });
  m.add(scene.createTimeline(), 0);
  m.to('#opencopy', { opacity: 0, y: 24, duration: 0.5 }, 0)
    .to('#opening .sfx-toggle', { opacity: 0, duration: 0.4 }, 0)
    .call(() => sfx?.swish(), undefined, 1.2)
    .call(() => sfx?.lid(), undefined, 3.25)
    .call(() => sfx?.rustle(), undefined, 3.6)
    .call(() => sfx?.chime(), undefined, 5.5)
    .fromTo('#flood', { opacity: 0 }, { opacity: 1, duration: 0.9, ease: 'power2.in' }, 5.65)
    .to('#opening', { opacity: 0, duration: 1.0, ease: 'power1.inOut' }, 6.6);
  return m;
}
