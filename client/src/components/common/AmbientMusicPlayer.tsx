import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Disc } from 'lucide-react';

export const AmbientMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Read saved preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('charis_music_enabled');
      if (saved === 'true') {
        setHasInteracted(true);
      }
    } catch {}
  }, []);

  const sendIframeCommand = (command: 'playVideo' | 'pauseVideo' | 'mute' | 'unMute') => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: command,
          args: [],
        }),
        '*'
      );
    }
  };

  const toggleMusic = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    setHasInteracted(true);

    if (nextState) {
      sendIframeCommand('unMute');
      sendIframeCommand('playVideo');
    } else {
      sendIframeCommand('mute');
    }

    try {
      localStorage.setItem('charis_music_enabled', nextState ? 'true' : 'false');
    } catch {}
  };

  return (
    <>
      {/* Headless Background YouTube Player */}
      <div
        className="fixed -z-50 opacity-0 pointer-events-none w-0 h-0 overflow-hidden"
        aria-hidden="true"
      >
        <iframe
          ref={iframeRef}
          id="charis-ambient-audio-stream"
          width="1"
          height="1"
          src="https://www.youtube.com/embed/BGiZSH-ozvM?enablejsapi=1&autoplay=1&loop=1&playlist=BGiZSH-ozvM&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&start=3260"
          title="CHARIS Ambient Music"
          allow="autoplay; encrypted-media"
        />
      </div>

      {/* Floating Ambient Sound Controller */}
      <aside
        aria-label="CHARIS Ambient Sound Controller"
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 select-none"
      >
        {/* Intro Badge: Tap For Vibes */}
        {!hasInteracted && !isPlaying && (
          <div className="animate-bounce flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141110] text-[#ffd46e] border border-[#ef4a23]/40 shadow-lg text-[10px] font-archivo uppercase font-bold tracking-wider">
            <Sparkles className="w-3 h-3 text-[#ef4a23] animate-pulse" />
            <span>Tap For Vibes ♪</span>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          {/* Animated 4-Bar Equalizer Waveform when music is playing */}
          {isPlaying && (
            <div
              className="flex items-end gap-[3px] h-8 px-2.5 py-1.5 bg-[#141110]/95 backdrop-blur-md rounded-2xl border border-[#ef4a23]/30 shadow-md animate-in fade-in slide-in-from-right-2 duration-300"
              title="CHARIS Atelier Radio Active"
            >
              <span className="w-1 bg-[#ef4a23] rounded-full animate-equalizer-1" />
              <span className="w-1 bg-[#ffd46e] rounded-full animate-equalizer-2" />
              <span className="w-1 bg-[#ef4a23] rounded-full animate-equalizer-3" />
              <span className="w-1 bg-[#ffd46e] rounded-full animate-equalizer-4" />
            </div>
          )}

          {/* Main Floating Toggle Button */}
          <div className="relative group">
            {/* Ambient Pulse Ring when Muted */}
            {!isPlaying && (
              <div className="absolute -inset-1.5 rounded-full border-2 border-dashed border-[#ef4a23]/40 animate-[spin_10s_linear_infinite] pointer-events-none" />
            )}

            {/* Glowing Aura when Playing */}
            {isPlaying && (
              <div className="absolute -inset-1.5 rounded-full bg-[#ef4a23]/20 blur-md animate-pulse pointer-events-none" />
            )}

            <button
              type="button"
              onClick={toggleMusic}
              aria-label={isPlaying ? 'Mute ambient melody' : 'Unmute ambient melody'}
              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden ${
                isPlaying
                  ? 'bg-[#141110] text-[#ffd46e] border-2 border-[#ef4a23] shadow-[0_4px_20px_rgba(239,74,35,0.4)] hover:scale-105'
                  : 'bg-[#faf3e4] text-[#141110] border-2 border-[#141110] shadow-[3px_3px_0px_#141110] hover:bg-white hover:translate-x-[-1px] hover:translate-y-[-1px]'
              }`}
            >
              {/* Spinning Vinyl Record Details when Playing */}
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 animate-[spin_4s_linear_infinite]">
                  <Disc className="w-full h-full text-[#ffd46e]/40" />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-[#ef4a23] border border-[#141110]" />
                </div>
              )}

              {/* Volume Icon */}
              <div className="relative z-10">
                {isPlaying ? (
                  <Volume2 className="w-6 h-6 text-[#ffd46e] transition-transform duration-200 group-hover:scale-110" />
                ) : (
                  <VolumeX className="w-6 h-6 text-[#141110] transition-transform duration-200 group-hover:scale-110" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Micro-Caption status */}
        <div className="px-2 py-0.5 rounded-md bg-[#faf3e4]/90 backdrop-blur-xs border border-[#141110]/10 shadow-xs">
          <p className="font-mono text-[9px] sm:text-[10px] tracking-wider uppercase font-bold text-[#141110]/80">
            {isPlaying ? (
              <span className="text-[#ef4a23] flex items-center gap-1">
                <span>♪</span>
                <span>Vibing</span>
                <span>·</span>
                <span className="text-[#141110]/60">Mute</span>
              </span>
            ) : (
              <span>[ Sound Off ]</span>
            )}
          </p>
        </div>
      </aside>
    </>
  );
};

export default AmbientMusicPlayer;
