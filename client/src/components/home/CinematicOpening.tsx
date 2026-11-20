import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './CinematicOpening.css';
import { LegacyOpening } from './LegacyOpening';
import type { GiftScene } from './gift3d/giftScene';
import { buildOpeningTimeline } from './gift3d/openingTimeline';
import { createSfx, type Sfx } from './gift3d/sfx';

interface CinematicOpeningProps {
  onOpeningComplete?: () => void;
}

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};
const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wasSeen = () => {
  try { return sessionStorage.getItem('charis-opened') === '1'; } catch { return false; }
};
const isLowEnd = () => window.innerWidth < 700 || (navigator.hardwareConcurrency || 8) <= 4;

/**
 * Premium 3D gift opening. Three.js is loaded lazily (only when the opening is shown).
 * If WebGL is missing or the scene fails, the original SVG opening is used instead,
 * so the website is always reachable.
 */
export const CinematicOpening: React.FC<CinematicOpeningProps> = (props) => {
  const [fallback, setFallback] = useState(() => !hasWebGL());
  const onFail = useCallback(() => setFallback(true), []);
  if (fallback) return <LegacyOpening {...props} />;
  return <Opening3D {...props} onFail={onFail} />;
};

const Opening3D: React.FC<CinematicOpeningProps & { onFail: () => void }> = ({ onOpeningComplete, onFail }) => {
  const initiallyHidden = () => wasSeen() || prefersReduced();
  const [hidden, setHidden] = useState(initiallyHidden);
  const [showReplay, setShowReplay] = useState(initiallyHidden);
  const [ready, setReady] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [run, setRun] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<GiftScene | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const sfxRef = useRef<Sfx | null>(null);
  const playingRef = useRef(false);

  const finish = useCallback(() => {
    tlRef.current?.kill();
    tlRef.current = null;
    playingRef.current = false;
    document.body.classList.remove('locked');
    try { sessionStorage.setItem('charis-opened', '1'); } catch { /* ignore */ }
    setHidden(true);
    setShowReplay(true);
    onOpeningComplete?.();
  }, [onOpeningComplete]);

  const play = useCallback(() => {
    if (playingRef.current || !sceneRef.current) return;
    playingRef.current = true;
    tlRef.current = buildOpeningTimeline(sceneRef.current, finish, sfxRef.current ?? undefined);
  }, [finish]);

  const finishRef = useRef(finish);
  const playRef = useRef(play);
  useEffect(() => { finishRef.current = finish; playRef.current = play; }, [finish, play]);

  useEffect(() => {
    if (hidden) return;
    document.body.classList.add('locked');
    let cancelled = false;
    let scene: GiftScene | null = null;

    (async () => {
      try {
        const mod = await import('./gift3d/giftScene'); // Three.js is only downloaded here
        if (cancelled || !canvasRef.current) return;
        scene = mod.createGiftScene(canvasRef.current, { low: isLowEnd(), onPullOpen: () => playRef.current() });
        sceneRef.current = scene;
        setReady(true);
      } catch {
        if (!cancelled) onFail();
      }
    })();

    const onResize = () => scene?.resize();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') finishRef.current(); };
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
      tlRef.current?.kill();
      tlRef.current = null;
      playingRef.current = false;
      scene?.dispose(); // frees geometries, materials, textures and the WebGL context
      sceneRef.current = null;
      setReady(false);
      document.body.classList.remove('locked');
    };
  }, [hidden, run, onFail]);

  const toggleSound = () => {
    const next = !soundOn;
    if (!sfxRef.current) sfxRef.current = createSfx();
    sfxRef.current.setEnabled(next); // audio only starts after this explicit click
    setSoundOn(next);
  };

  const replay = () => {
    gsap.set(['#opening', '#opencopy', '#flood', '#opening .sfx-toggle'], { clearProps: 'all' });
    window.scrollTo(0, 0);
    setRun((r) => r + 1);
    setHidden(false);
  };

  return (
    <>
      <div id="opening" className="gl3d" role="dialog" aria-modal="true" aria-label="Gift opening introduction" hidden={hidden}>
        <canvas key={run} ref={canvasRef} className="gl" aria-hidden="true" />
        <div className="flood" id="flood" />
        <div className="logo">CHARIS</div>
        <button className="skip" id="skip" type="button" onClick={finish}>Skip</button>
        <button className="sfx-toggle" type="button" aria-pressed={soundOn} onClick={toggleSound}>
          {soundOn ? 'Sound on' : 'Sound off'}
        </button>
        <div className="open-copy gl3d" id="opencopy">
          <p>Something special is waiting for you.</p>
          <button className="btn gold" id="openbtn" type="button" disabled={!ready} onClick={play}>
            Open Gift
          </button>
          <small className="hint">Drag to look around · or pull the ribbon</small>
        </div>
      </div>

      <button className={`replay ${showReplay && hidden ? 'show' : ''}`} id="replay" type="button" onClick={replay}>
        Replay opening
      </button>
    </>
  );
};

export default CinematicOpening;
