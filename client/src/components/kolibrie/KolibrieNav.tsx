import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useBag } from '../../context/BagContext';

interface KolibrieNavProps {
  onOpenAteliers?: () => void;
}

export const KolibrieNav: React.FC<KolibrieNavProps> = ({ onOpenAteliers }) => {
  const { totalCount, setIsBagOpen } = useBag();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (isHome && targetId.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        if (window.Lenis && (window as any).lenisInstance) {
          (window as any).lenisInstance.scrollTo(target, { duration: 1.4 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else if (!isHome && targetId.startsWith('#')) {
      e.preventDefault();
      navigate('/' + targetId);
    }
  };

  const handleAteliersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenAteliers) {
      onOpenAteliers();
    } else {
      document.dispatchEvent(new CustomEvent('open:atelier-modal'));
    }
  };

  return (
    <nav
      id="kolibrie-nav"
      className="fixed top-0 left-0 w-full z-50 pointer-events-none px-[1.5rem] py-[1.25rem] max-[600px]:px-[1rem] max-[600px]:py-[1rem] flex items-center justify-between"
    >
      {/* Left Wordmark */}
      <div className="pointer-events-auto">
        <Link
          to="/"
          className="font-yellowtail text-[#ef4a23] text-[3.6rem] max-[600px]:text-[2.6rem] leading-none inline-block mt-[0.2rem] select-none hover:opacity-90 transition-opacity"
          style={{
            transform: 'rotate(-8deg)',
            transformOrigin: 'left center',
            display: 'inline-block'
          }}
        >
          charis.
        </Link>
      </div>

      {/* Centre Pill (Desktop only, hidden ≤991px) */}
      <div className="hidden lg:flex pointer-events-auto absolute left-1/2 -translate-x-1/2 top-[1.25rem] h-[3rem] px-[1.25rem] bg-white rounded-full shadow-[0_4px_20px_rgba(20,17,16,0.06)] items-center gap-[1.5rem]">
        <Link
          to="/consultation"
          className="font-archivo text-[#141110] text-[1.05rem] uppercase tracking-[-0.01em] relative flex flex-col items-center py-[0.2rem] group"
          style={{ fontWeight: 700, fontStretch: '72%' }}
        >
          <span className={location.pathname === '/consultation' ? 'text-[#ef4a23]' : ''}>Consultation</span>
          <span
            data-draw-line
            data-line-color="#ef4a23"
            className="absolute top-full left-0 w-full h-[0.5em] pointer-events-none"
          />
        </Link>

        <Link
          to="/gift-studio"
          className="font-archivo text-[#141110] text-[1.05rem] uppercase tracking-[-0.01em] relative flex flex-col items-center py-[0.2rem] group"
          style={{ fontWeight: 700, fontStretch: '72%' }}
        >
          <span className={location.pathname === '/gift-studio' ? 'text-[#ef4a23]' : ''}>Gift Studio</span>
          <span
            data-draw-line
            data-line-color="#ef4a23"
            className="absolute top-full left-0 w-full h-[0.5em] pointer-events-none"
          />
        </Link>

        {isHome ? (
          <a
            href="#drops"
            onClick={(e) => handleSmoothScroll(e, '#drops')}
            className="font-archivo text-[#141110] text-[1.05rem] uppercase tracking-[-0.01em] relative flex flex-col items-center py-[0.2rem] group"
            style={{ fontWeight: 700, fontStretch: '72%' }}
          >
            <span>Curations</span>
            <span
              data-draw-line
              data-line-color="#ef4a23"
              className="absolute top-full left-0 w-full h-[0.5em] pointer-events-none"
            />
          </a>
        ) : (
          <Link
            to="/#drops"
            className="font-archivo text-[#141110] text-[1.05rem] uppercase tracking-[-0.01em] relative flex flex-col items-center py-[0.2rem] group"
            style={{ fontWeight: 700, fontStretch: '72%' }}
          >
            <span>Curations</span>
            <span
              data-draw-line
              data-line-color="#ef4a23"
              className="absolute top-full left-0 w-full h-[0.5em] pointer-events-none"
            />
          </Link>
        )}

        <button
          onClick={handleAteliersClick}
          className="font-archivo text-[#141110] hover:text-[#ef4a23] text-[1.05rem] uppercase tracking-[-0.01em] relative flex flex-col items-center py-[0.2rem] group cursor-pointer"
          style={{ fontWeight: 700, fontStretch: '72%' }}
        >
          <span>Ateliers</span>
          <span
            data-draw-line
            data-line-color="#ef4a23"
            className="absolute top-full left-0 w-full h-[0.5em] pointer-events-none"
          />
        </button>
      </div>

      {/* Right Studio & Bag Pill */}
      <div className="pointer-events-auto flex items-center gap-[0.75rem]">
        <Link
          to="/consultation"
          className="h-[3rem] max-[600px]:h-[2.5rem] px-[1.25rem] max-[600px]:px-[0.9rem] bg-white rounded-full shadow-[0_4px_20px_rgba(20,17,16,0.06)] flex items-center gap-[0.5rem] font-archivo uppercase text-[1.05rem] max-[600px]:text-[0.95rem] tracking-[-0.01em] text-[#141110] hover:text-[#ef4a23] transition-colors"
          style={{ fontWeight: 700, fontStretch: '72%' }}
        >
          <span className="w-[0.45rem] h-[0.45rem] rounded-full bg-[#ef4a23] shrink-0" />
          <span>Consult</span>
        </Link>

        <button
          onClick={() => setIsBagOpen(true)}
          className="h-[3rem] max-[600px]:h-[2.5rem] px-[1rem] max-[600px]:px-[0.75rem] bg-white rounded-full shadow-[0_4px_20px_rgba(20,17,16,0.06)] flex items-center gap-[0.4rem] font-archivo uppercase text-[1.05rem] max-[600px]:text-[0.95rem] text-[#141110] cursor-pointer hover:bg-[#ffd46e] transition-colors"
          style={{ fontWeight: 700, fontStretch: '72%' }}
          aria-label="View shopping bag"
        >
          <span>Bag</span>
          <span className="w-[1.25rem] h-[1.25rem] rounded-full bg-[#ef4a23] text-white text-[0.8rem] flex items-center justify-center font-bold">
            {totalCount}
          </span>
        </button>
      </div>
    </nav>
  );
};
