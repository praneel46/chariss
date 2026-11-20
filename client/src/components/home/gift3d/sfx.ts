/** Tiny synthesized sound effects (no audio files). Muted by default; only starts after an explicit click. */
export interface Sfx { setEnabled(v: boolean): void; swish(): void; rustle(): void; lid(): void; chime(): void }

export function createSfx(): Sfx {
  let ctx: AudioContext | null = null;
  let on = false;
  const get = () => {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  };
  const noise = (c: AudioContext, dur: number, type: BiquadFilterType, f0: number, f1: number, gain: number, at = 0) => {
    const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = buf;
    const flt = c.createBiquadFilter(); flt.type = type; flt.Q.value = 0.8;
    const g = c.createGain(); const t0 = c.currentTime + at;
    flt.frequency.setValueAtTime(f0, t0); flt.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(gain, t0 + dur * 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(flt).connect(g).connect(c.destination); src.start(t0);
  };
  const tone = (c: AudioContext, freq: number, dur: number, gain: number, at = 0, endFreq = freq) => {
    const o = c.createOscillator(); o.type = 'sine'; const g = c.createGain(); const t0 = c.currentTime + at;
    o.frequency.setValueAtTime(freq, t0); o.frequency.exponentialRampToValueAtTime(endFreq, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(c.destination); o.start(t0); o.stop(t0 + dur + 0.05);
  };
  return {
    setEnabled(v) { on = v; if (v) get(); },
    swish() { if (!on) return; const c = get(); noise(c, 0.9, 'bandpass', 1200, 3600, 0.09); noise(c, 0.7, 'bandpass', 3000, 1400, 0.05, 0.5); },
    rustle() { if (!on) return; const c = get(); for (let i = 0; i < 7; i++) noise(c, 0.12 + Math.random() * 0.1, 'highpass', 3200, 5200, 0.04, i * 0.17 + Math.random() * 0.08); },
    lid() { if (!on) return; const c = get(); tone(c, 110, 0.28, 0.22, 0, 55); noise(c, 0.35, 'lowpass', 900, 200, 0.07); },
    chime() { if (!on) return; const c = get(); [1319, 1760, 2093, 2637].forEach((f, i) => tone(c, f, 1.7, 0.05, i * 0.12)); },
  };
}
