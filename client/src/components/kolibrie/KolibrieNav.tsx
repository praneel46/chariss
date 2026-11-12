import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useBag } from '../../context/BagContext';

export const KolibrieNav: React.FC = () => {
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
      <div className="hidden lg:flex pointer-events-auto absolute left-1/2 -translate-x-1/2 top-[1.25rem] h-[3rem] px-[1.25rem] bg-white rounded-full shadow-[0_4px_20px_rgba(20,17,16,0.06)] items-center gap-[1.75rem]">
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
            href="#curators"
            onClick={(e) => handleSmoothScroll(e, '#curators')}
            className="font-archivo text-[#141110] hover:text-[#ef4a23] text-[1.05rem] uppercase tracking-[-0.01em] relative flex flex-col items-center py-[0.2rem] group cursor-pointer"
            style={{ fontWeight: 700, fontStretch: '72%' }}
          >
            <span>Curators</span>
            <span
              data-draw-line
              data-line-color="#ef4a23"
              className="absolute top-full left-0 w-full h-[0.5em] pointer-events-none"
            />
          </a>
        ) : (
          <Link
            to="/#curators"
            className="font-archivo text-[#141110] hover:text-[#ef4a23] text-[1.05rem] uppercase tracking-[-0.01em] relative flex flex-col items-center py-[0.2rem] group cursor-pointer"
            style={{ fontWeight: 700, fontStretch: '72%' }}
          >
            <span>Curators</span>
            <span
              data-draw-line
              data-line-color="#ef4a23"
              className="absolute top-full left-0 w-full h-[0.5em] pointer-events-none"
            />
          </Link>
        )}
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

      {/* Mobile Floating Bottom Navigation Dock (≤1023px) */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto w-[min(94vw,420px)] bg-[#faf3e4]/95 backdrop-blur-md border border-[#141110]/15 shadow-[0_8px_30px_rgba(20,17,16,0.15)] rounded-full px-3 py-2 flex items-center justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 text-[0.7rem] font-archivo uppercase font-bold tracking-wider ${
            location.pathname === '/' ? 'text-[#ef4a23]' : 'text-[#141110]/70'
          }`}
        >
          <span className="text-base leading-none">🕊️</span>
          <span>Home</span>
        </Link>

        <Link
          to="/gift-studio"
          className={`flex flex-col items-center gap-0.5 text-[0.7rem] font-archivo uppercase font-bold tracking-wider ${
            location.pathname === '/gift-studio' ? 'text-[#ef4a23]' : 'text-[#141110]/70'
          }`}
        >
          <span className="text-base leading-none">🎁</span>
          <span>Studio</span>
        </Link>

        {isHome ? (
          <a
            href="#curators"
            onClick={(e) => handleSmoothScroll(e, '#curators')}
            className="flex flex-col items-center gap-0.5 text-[0.7rem] font-archivo uppercase font-bold tracking-wider text-[#141110]/70 hover:text-[#ef4a23] cursor-pointer"
          >
            <span className="text-base leading-none">👥</span>
            <span>Curators</span>
          </a>
        ) : (
          <Link
            to="/#curators"
            className="flex flex-col items-center gap-0.5 text-[0.7rem] font-archivo uppercase font-bold tracking-wider text-[#141110]/70 hover:text-[#ef4a23]"
          >
            <span className="text-base leading-none">👥</span>
            <span>Curators</span>
          </Link>
        )}

        <Link
          to="/consultation"
          className={`flex flex-col items-center gap-0.5 text-[0.7rem] font-archivo uppercase font-bold tracking-wider ${
            location.pathname === '/consultation' ? 'text-[#ef4a23]' : 'text-[#141110]/70'
          }`}
        >
          <span className="text-base leading-none">✨</span>
          <span>Consult</span>
        </Link>

        <button
          onClick={() => setIsBagOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[0.7rem] font-archivo uppercase font-bold tracking-wider text-[#141110]/70 relative cursor-pointer"
        >
          <span className="text-base leading-none">🛍️</span>
          <span>Bag</span>
          {totalCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ef4a23] text-white text-[9px] flex items-center justify-center font-bold">
              {totalCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};
