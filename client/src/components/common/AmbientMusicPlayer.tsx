import React, { useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Disc } from 'lucide-react';
import { useBag } from '../../context/BagContext';

const YOUTUBE_VIDEO_ID = 'BGiZSH-ozvM'; // Kinya Coffee track (roti. - Let’s relax with some music)
const YOUTUBE_START_SECONDS = 3260; // 54m 20s

export const AmbientMusicPlayer: React.FC = () => {
  const { isBagOpen } = useBag();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isIframeReadyRef = useRef<boolean>(false);

  // Send API command to YouTube iframe via postMessage
  const sendIframeCommand = useCallback((func: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      } catch {
        // Safe cross-origin postMessage handler
      }
    }
  }, []);

  const handleIframeLoad = () => {
    isIframeReadyRef.current = true;
    // Always start strictly muted to comply with browser autoplay policies & prevent overlap
    sendIframeCommand('mute');
  };

  const toggleMusic = () => {
    if (!isIframeReadyRef.current) return;

    if (isPlaying) {
      // Pause and mute YouTube audio stream completely
      sendIframeCommand('pauseVideo');
      sendIframeCommand('mute');
      setIsPlaying(false);
    } else {
      // Unmute, set volume, and play single YouTube audio stream
      sendIframeCommand('unMute');
      sendIframeCommand('setVolume', [65]);
      sendIframeCommand('playVideo');
      setIsPlaying(true);
    }
  };

  return (
    <>
      {/* Single, Dedicated YouTube Background Audio Iframe (Exact Kinya Coffee Source) */}
      <div className="fixed -z-50 opacity-0 pointer-events-none" aria-hidden="true">
        <iframe
          ref={iframeRef}
          width="1"
          height="1"
          src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&autoplay=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&start=${YOUTUBE_START_SECONDS}`}
          title="CHARIS Background Ambient Stream"
          allow="autoplay; encrypted-media"
          onLoad={handleIframeLoad}
        />
      </div>

      {/* Floating Ambient Sound Controller */}
      <aside
        id="ambient-music-player"
        aria-label="CHARIS Ambient Sound Controller"
        className={`fixed bottom-6 right-4 sm:bottom-6 sm:right-6 z-[1250] flex flex-col items-end gap-2.5 select-none pointer-events-auto transition-opacity duration-300 ${
          isBagOpen ? 'opacity-0 pointer-events-none !hidden' : 'opacity-100'
        }`}
      >
        {/* Intro Tooltip Badge: Tap For Vibes with Brutalist Corner Brackets */}
        {!isPlaying && (
          <div
            onClick={toggleMusic}
            className="animate-bounce relative bg-[#141110] text-[#faf3e4] px-4 py-2 font-mono text-xs font-bold border-2 border-[#141110] shadow-xl cursor-pointer hover:scale-105 transition-transform"
          >
            {/* 4 Corner Accent Brackets matching Kinya Coffee */}
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#ef4a23]" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#ef4a23]" />
            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#ef4a23]" />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#ef4a23]" />
            <div className="flex items-center gap-2">
              <span className="text-[#ef4a23] text-sm animate-spin">♪</span>
              <span className="tracking-widest uppercase">TAP FOR VIBES</span>
              <span className="w-1.5 h-3 bg-[#ef4a23] animate-pulse ml-0.5" />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          {/* Animated 4-Bar Equalizer Waveform when music is playing */}
          {isPlaying && (
            <div
              className="flex items-end gap-[3px] h-8 px-2.5 py-1.5 bg-[#141110]/95 backdrop-blur-md rounded-2xl border border-[#ef4a23]/40 shadow-md animate-in fade-in slide-in-from-right-2 duration-300"
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
              <div className="absolute -inset-1.5 rounded-full bg-[#ef4a23]/30 blur-md animate-pulse pointer-events-none" />
            )}

            <button
              type="button"
              onClick={toggleMusic}
              aria-label={isPlaying ? 'Mute background music' : 'Unmute background music'}
              title={isPlaying ? 'Mute background music' : 'Unmute background music'}
              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden ${
                isPlaying
                  ? 'bg-[#141110] text-[#ffd46e] border-2 border-[#ef4a23] shadow-[0_4px_25px_rgba(239,74,35,0.45)] hover:scale-105'
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
        <div className="px-2.5 py-1 rounded-md bg-[#faf3e4]/95 backdrop-blur-xs border border-[#141110]/15 shadow-xs">
          <p className="font-mono text-[9px] sm:text-[10px] tracking-wider uppercase font-bold text-[#141110]">
            {isPlaying ? (
              <span className="text-[#ef4a23] flex items-center gap-1.5 font-extrabold">
                <span className="animate-pulse">♪</span>
                <span>VIBING</span>
                <span>·</span>
                <span className="text-[#141110]/60">CLICK TO MUTE</span>
              </span>
            ) : (
              <span>[ SOUND OFF ]</span>
            )}
          </p>
        </div>
      </aside>
    </>
  );
};

export default AmbientMusicPlayer;
