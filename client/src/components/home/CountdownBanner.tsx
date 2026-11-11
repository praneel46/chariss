import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CountdownBanner: React.FC = () => {
  // Live ticking countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 18,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="bg-[#FAF9F6] border-y border-[#292820]/10 py-8 px-4 text-center">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left note */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-[#B69A78] text-xs font-mono uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seasonal Autumn Harvest Drop</span>
          </div>
          <h3 className="font-serif text-lg md:text-xl font-bold text-[#292820] mt-0.5">
            Curated Artisanal Gift Batches
          </h3>
        </div>

        {/* Center Countdown (Observed layout in video) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-col items-center">
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#292820] tracking-tight">
              {formatNumber(timeLeft.days)}
            </span>
            <span className="text-[10px] font-mono uppercase text-[#B69A78] tracking-widest mt-0.5">
              Days
            </span>
          </div>

          <span className="font-display text-2xl text-[#292820]/40 -translate-y-2">:</span>

          <div className="flex flex-col items-center">
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#292820] tracking-tight">
              {formatNumber(timeLeft.hours)}
            </span>
            <span className="text-[10px] font-mono uppercase text-[#B69A78] tracking-widest mt-0.5">
              Hours
            </span>
          </div>

          <span className="font-display text-2xl text-[#292820]/40 -translate-y-2">:</span>

          <div className="flex flex-col items-center">
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#292820] tracking-tight">
              {formatNumber(timeLeft.minutes)}
            </span>
            <span className="text-[10px] font-mono uppercase text-[#B69A78] tracking-widest mt-0.5">
              Mins
            </span>
          </div>

          <span className="font-display text-2xl text-[#292820]/40 -translate-y-2">:</span>

          <div className="flex flex-col items-center">
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#D4A359] tracking-tight">
              {formatNumber(timeLeft.seconds)}
            </span>
            <span className="text-[10px] font-mono uppercase text-[#D4A359] tracking-widest mt-0.5">
              Secs
            </span>
          </div>
        </div>

        {/* Right CTA */}
        <Link
          to="/discover"
          className="text-xs font-mono uppercase tracking-widest text-[#292820] hover:text-[#B69A78] font-bold border-b border-[#292820] hover:border-[#B69A78] pb-0.5 transition-colors"
        >
          View The Harvest Drop ↗
        </Link>
      </div>
    </div>
  );
};
