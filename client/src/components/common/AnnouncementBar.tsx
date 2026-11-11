import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#151419] text-[#FAF9F6] text-xs py-2.5 px-4 tracking-wide relative border-b border-[#292820]/40 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A359] animate-pulse" />
          <span className="text-[#DDE7DD]/90">
            Every gift has a feeling. <span className="text-[#FAF9F6] font-medium">Experience CHARIS AI Consultation</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[#D4A359]">
          <Link
            to="/consultation"
            className="inline-flex items-center gap-1 hover:text-[#FAF9F6] transition-colors font-medium text-[11px] uppercase tracking-wider"
          >
            Start Free Consultation <ArrowUpRight className="w-3 h-3" />
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Close banner"
            className="text-stone-400 hover:text-[#FAF9F6] transition-colors ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
