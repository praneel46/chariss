import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { getBoxSVG } from '../../utils/giftBoxArt';

export interface CinematicOpeningProps {
  onOpeningComplete?: () => void;
}

export const LegacyOpening: React.FC<CinematicOpeningProps> = ({ onOpeningComplete }) => {
  const initiallyHidden = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('intro') === 'true' || params.get('replay') === 'true') return false;
      return (
        sessionStorage.getItem('charis-opened') === '1' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    } catch {
      return false;
    }
  };
  const [hidden, setHidden] = useState(initiallyHidden);
  const [showReplay, setShowReplay] = useState(initiallyHidden);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const giftMountRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isPlayingRef = useRef(false);
  const animationFrameRef = useRef(0);
  const ambOnRef = useRef(true);

  // Canvas particle state
  const particlesRef = useRef<{
    amb: Array<{ x: number; y: number; r: number; v: number; t: number }>;
    conf: Array<{ x: number; y: number; vx: number; vy: number; w: number; h: number; r: number; vr: number; c: string; life: number }>;
    w: number;
    h: number;
    live: boolean;
  }>({
    amb: [],
    conf: [],
    w: 0,
    h: 0,
    live: false,
  });

  const COL = ['#D9C6A7', '#f4e1b4', '#A53E35', '#FAF5EC', '#e0a64c'];

  const initAmbient = () => {
    const p = particlesRef.current;
    p.amb = [];
    const n = p.w < 600 ? 26 : 46;
    for (let i = 0; i < n; i++) {
      p.amb.push({
        x: Math.random() * p.w,
        y: Math.random() * p.h,
        r: Math.random() * 1.8 + 0.4,
        v: Math.random() * 0.25 + 0.05,
        t: Math.random() * 6.28,
      });
    }
  };

  const resizeCanvas = () => {
    const cv = canvasRef.current;
    if (!cv) return;
    const p = particlesRef.current;
    const d = Math.min(window.devicePixelRatio || 1, 2);
    p.w = window.innerWidth;
    p.h = window.innerHeight;
    cv.width = p.w * d;
    cv.height = p.h * d;
    const ctx = cv.getContext('2d');
    if (ctx) ctx.setTransform(d, 0, 0, d, 0, 0);
  };

  const burstConfetti = () => {
    const p = particlesRef.current;
    const n = p.w < 600 ? 90 : 150;
    const ox = p.w / 2;
    const oy = p.h * 0.46;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.28;
      const s = Math.random() * 11 + 4;
      p.conf.push({
        x: ox,
        y: oy,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 4,
        w: Math.random() * 8 + 4,
        h: Math.random() * 5 + 3,
        r: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.35,
        c: COL[i % 5],
        life: 1,
      });
    }
  };

  const renderParticles = () => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const p = particlesRef.current;

    ctx.clearRect(0, 0, p.w, p.h);

    if (ambOnRef.current) {
      const t = performance.now() / 1000;
      for (const pt of p.amb) {
        pt.y -= pt.v;
        if (pt.y < -4) {
          pt.y = p.h + 4;
          pt.x = Math.random() * p.w;
        }
        ctx.globalAlpha = 0.25 + 0.5 * Math.abs(Math.sin(t * 0.8 + pt.t));
        ctx.fillStyle = '#e8c98a';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, 6.28);
        ctx.fill();
      }
    }

    for (const c of p.conf) {
      c.vy += 0.22;
      c.vx *= 0.985;
      c.x += c.vx;
      c.y += c.vy;
      c.r += c.vr;
      c.life -= 0.0048;
      ctx.save();
      ctx.globalAlpha = Math.max(c.life, 0);
      ctx.translate(c.x, c.y);
      ctx.rotate(c.r);
      ctx.fillStyle = c.c;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
    }

    p.conf = p.conf.filter(c => c.life > 0 && c.y < p.h + 40);
    ctx.globalAlpha = 1;

    if (p.live && (ambOnRef.current || p.conf.length > 0)) {
      animationFrameRef.current = requestAnimationFrame(renderParticles);
    }
  };

  const finish = (_instant = false) => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    isPlayingRef.current = false;
    particlesRef.current.live = false;
    cancelAnimationFrame(animationFrameRef.current);
    document.body.classList.remove('locked');

    try {
      sessionStorage.setItem('charis-opened', '1');
    } catch {
      // ignore
    }

    setHidden(true);
    setShowReplay(true);

    if (onOpeningComplete) {
      onOpeningComplete();
    }
  };

  const playExperience = () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      finish(true);
      return;
    }

    const mount = giftMountRef.current;
    if (!mount) {
      finish(true);
      return;
    }

    const q = (sel: string) => mount.querySelector(sel);

    const tl = gsap.timeline({
      onComplete: () => finish(),
    });
    timelineRef.current = tl;

    tl.to('#opencopy', { opacity: 0, y: 24, duration: 0.5 }, 0)
      .to('#spot', { opacity: 1, scale: 1.2, duration: 1.2, ease: 'sine.inOut' }, 0)
      .to(mount, { scale: 1.08, duration: 1.1, ease: 'sine.inOut' }, 0)
      .to(q('.glow'), { opacity: 0.4, duration: 1 }, 0.2)
      .to([q('.lp1'), q('.lp2')], { scale: 1.08, svgOrigin: '155 92', duration: 0.9 }, 0.2)
      .to(q('.lp1'), { x: -36, rotation: -30, svgOrigin: '133 90', opacity: 0, duration: 0.9, ease: 'power2.inOut' }, 1.1)
      .to(q('.lp2'), { x: 36, rotation: 30, svgOrigin: '177 90', opacity: 0, duration: 0.9, ease: 'power2.inOut' }, 1.1)
      .to(q('.t1'), { x: -46, y: 26, rotation: -25, opacity: 0, duration: 0.9, ease: 'power2.in' }, 1.2)
      .to(q('.t2'), { x: 46, y: 26, rotation: 25, opacity: 0, duration: 0.9, ease: 'power2.in' }, 1.2)
      .to(q('.kn'), { scale: 0, svgOrigin: '155 94', opacity: 0, duration: 0.5 }, 1.15)
      .to(q('.rb'), { opacity: 0, duration: 0.8, ease: 'power1.in' }, 1.3)
      .to(q('.lid'), { y: -100, rotation: -9, svgOrigin: '130 124', duration: 1, ease: 'power3.out' }, 2.2)
      .to(q('.inner'), { opacity: 0.95, duration: 0.8 }, 2.3)
      .to(q('.glow'), { opacity: 1, scale: 1.35, svgOrigin: '155 122', duration: 1, ease: 'power2.out' }, 2.3)
      .to('#spot', { opacity: 1, scale: 1.8, duration: 1.1 }, 2.3)
      .fromTo('#ring', { scale: 0.2, opacity: 0.95 }, { scale: 30, opacity: 0, duration: 1.5, ease: 'power2.out' }, 3.0)
      .call(burstConfetti, undefined, 3.0)
      .fromTo('#flash', { opacity: 0 }, { opacity: 0.55, duration: 0.12, yoyo: true, repeat: 1 }, 3.0)
      .fromTo('#rays', { opacity: 0, rotation: 0 }, { opacity: 0.9, rotation: 25, duration: 1.3, ease: 'power1.out' }, 3.0)
      .to('#rays', { opacity: 0, duration: 0.8 }, 4.2)
      .to(mount, { scale: 0.2, opacity: 0, duration: 1, ease: 'power3.in' }, 3.9)
      .to('#opening .logo', { color: '#11100F', duration: 1.2 }, 4.4)
      .call(() => { ambOnRef.current = false; }, undefined, 4.4)
      .to('#opening', { backgroundColor: '#FAF5EC', duration: 1.2, ease: 'sine.inOut' }, 4.5)
      .to('#opening', { opacity: 0, duration: 1, ease: 'power1.inOut' }, 5.4);
  };

  const resetOpening = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    const mount = giftMountRef.current;
    if (mount) {
      mount.innerHTML = getBoxSVG('og');
    }
    gsap.set(['#opening', '#spot', '#giftmount', '#opencopy', '#ring', '#flash', '#rays', '#opening .logo'], { clearProps: 'all' });
    document.body.classList.add('locked');
    setHidden(false);
    isPlayingRef.current = false;
    ambOnRef.current = true;
    particlesRef.current.live = true;
    resizeCanvas();
    initAmbient();
    animationFrameRef.current = requestAnimationFrame(renderParticles);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem('charis-opened') === '1';
    } catch {
      // ignore
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (seen || reduced) {
      setHidden(true);
      setShowReplay(true);
    } else {
      document.body.classList.add('locked');
      const mount = giftMountRef.current;
      if (mount) {
        mount.innerHTML = getBoxSVG('og');
      }
      particlesRef.current.live = true;
      ambOnRef.current = true;
      resizeCanvas();
      initAmbient();
      animationFrameRef.current = requestAnimationFrame(renderParticles);
    }

    const handleResize = () => {
      if (particlesRef.current.live) {
        resizeCanvas();
        initAmbient();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !hidden) {
        finish(true);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('locked');
      cancelAnimationFrame(animationFrameRef.current);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return (
    <>
      <div id="opening" role="dialog" aria-modal="true" aria-label="Gift opening introduction" hidden={hidden}>
        <canvas id="fxcv" ref={canvasRef} aria-hidden="true" />
        <div className="spot" id="spot" />
        <div className="rays" id="rays" />
        <div className="logo">CHARIS</div>
        <button
          className="skip"
          id="skip"
          type="button"
          onClick={() => finish(true)}
        >
          Skip
        </button>
        <div className="giftwrap" id="giftwrap">
          <div className="ring" id="ring" />
          <div id="giftmount" ref={giftMountRef} />
        </div>
        <div className="open-copy" id="opencopy">
          <p>Something special is waiting for you.</p>
          <button
            className="btn gold"
            id="openbtn"
            type="button"
            onClick={playExperience}
          >
            Find the perfect gift
          </button>
        </div>
        <div className="flash" id="flash" />
      </div>

      <button
        className={`replay ${showReplay ? 'show' : ''}`}
        id="replay"
        type="button"
        onClick={resetOpening}
      >
        Replay opening
      </button>
    </>
  );
};
