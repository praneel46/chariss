import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useBag } from '../../context/BagContext';
import { useAuth } from '../../context/AuthContext';
import { ChevronDown, LogOut, LayoutDashboard, Gift, Compass } from 'lucide-react';

export const KolibrieNav: React.FC = () => {
  const { totalCount, setIsBagOpen } = useBag();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false);
    await logout();
    navigate('/');
  };

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
      className="fixed top-0 left-0 w-full z-[1200] pointer-events-none px-[1.5rem] py-[1.25rem] max-[600px]:px-[1rem] max-[600px]:py-[1rem] flex items-center justify-between"
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

      {/* Right Actions: Login/Sign Up, Consult & Bag */}
      <div className="pointer-events-auto flex items-center gap-[0.5rem] sm:gap-[0.75rem]">
        {/* Login / Sign Up options near header */}
        {/* User Profile Dropdown with Logout & Dashboard */}
        {user ? (
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
              className="h-[3rem] max-[600px]:h-[2.4rem] px-[0.9rem] max-[600px]:px-[0.7rem] bg-white rounded-full shadow-[0_4px_20px_rgba(20,17,16,0.06)] flex items-center gap-[0.45rem] font-archivo uppercase text-[0.95rem] max-[600px]:text-[0.8rem] text-[#141110] hover:text-[#ef4a23] transition-colors cursor-pointer border border-transparent hover:border-[#141110]/10"
              style={{ fontWeight: 700, fontStretch: '72%' }}
              title="My Account & Profile Options"
              aria-expanded={isProfileDropdownOpen}
              aria-haspopup="true"
            >
              <span className="w-5 h-5 rounded-full bg-[#ef4a23] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span>{user.name.split(' ')[0]}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isProfileDropdownOpen ? 'rotate-180 text-[#ef4a23]' : 'text-[#141110]/60'
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 top-[calc(100%+0.5rem)] w-64 bg-white rounded-2xl shadow-[0_12px_40px_rgba(20,17,16,0.14)] border border-[#141110]/10 p-2 z-[1300] animate-in fade-in zoom-in-95 duration-150">
                {/* User Summary Header */}
                <div className="p-3 border-b border-[#141110]/8 bg-[#faf3e4]/60 rounded-xl mb-1">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-[#141110] text-[#ffd46e] flex items-center justify-center text-xs font-bold shrink-0 border border-[#ef4a23]">
                      {user.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-archivo text-xs uppercase font-bold text-[#141110] truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] font-mono text-[#141110]/60 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffd46e]/40 text-[#141110] text-[9px] font-archivo uppercase font-bold tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4a23]" />
                    <span>Private Atelier Member</span>
                  </div>
                </div>

                {/* Dropdown Navigation Links */}
                <div className="space-y-0.5 py-1">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-archivo uppercase font-bold text-[#141110] hover:bg-[#faf3e4] hover:text-[#ef4a23] transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#ef4a23]" />
                    <span>Atelier Dashboard</span>
                  </Link>

                  <Link
                    to="/consultation"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-archivo uppercase font-bold text-[#141110] hover:bg-[#faf3e4] hover:text-[#ef4a23] transition-colors"
                  >
                    <Compass className="w-4 h-4 text-[#ef4a23]" />
                    <span>New Consultation</span>
                  </Link>

                  <Link
                    to="/gift-studio"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-archivo uppercase font-bold text-[#141110] hover:bg-[#faf3e4] hover:text-[#ef4a23] transition-colors"
                  >
                    <Gift className="w-4 h-4 text-[#ef4a23]" />
                    <span>Gift Studio</span>
                  </Link>
                </div>

                <div className="border-t border-[#141110]/8 pt-1 mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-archivo uppercase font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center bg-white rounded-full shadow-[0_4px_20px_rgba(20,17,16,0.06)] h-[3rem] max-[600px]:h-[2.4rem] p-1 gap-1">
            <Link
              to="/login?mode=login"
              className="h-full px-[0.85rem] max-[600px]:px-[0.6rem] rounded-full flex items-center font-archivo uppercase text-[0.95rem] max-[600px]:text-[0.8rem] text-[#141110] hover:text-[#ef4a23] hover:bg-[#faf3e4] transition-colors"
              style={{ fontWeight: 700, fontStretch: '72%' }}
            >
              Login
            </Link>
            <Link
              to="/login?mode=signup"
              className="h-full px-[0.85rem] max-[600px]:px-[0.6rem] rounded-full bg-[#ef4a23] hover:bg-[#141110] text-white flex items-center font-archivo uppercase text-[0.95rem] max-[600px]:text-[0.8rem] transition-colors shadow-xs"
              style={{ fontWeight: 700, fontStretch: '72%' }}
            >
              Sign Up
            </Link>
          </div>
        )}

        <Link
          to="/consultation"
          className="hidden md:flex h-[3rem] max-[600px]:h-[2.4rem] px-[1.25rem] max-[600px]:px-[0.85rem] bg-white rounded-full shadow-[0_4px_20px_rgba(20,17,16,0.06)] items-center gap-[0.5rem] font-archivo uppercase text-[1.05rem] max-[600px]:text-[0.85rem] tracking-[-0.01em] text-[#141110] hover:text-[#ef4a23] transition-colors"
          style={{ fontWeight: 700, fontStretch: '72%' }}
        >
          <span className="w-[0.45rem] h-[0.45rem] rounded-full bg-[#ef4a23] shrink-0" />
          <span>Consult</span>
        </Link>

        {/* Gift Bag Drawer Button - Hidden on main homepage navigation per UX requirements */}
        {!isHome && (
          <button
            onClick={() => setIsBagOpen(true)}
            className="h-[3rem] max-[600px]:h-[2.4rem] px-[1rem] max-[600px]:px-[0.75rem] bg-white rounded-full shadow-[0_4px_20px_rgba(20,17,16,0.06)] flex items-center gap-[0.4rem] font-archivo uppercase text-[1.05rem] max-[600px]:text-[0.85rem] text-[#141110] cursor-pointer hover:bg-[#ffd46e] transition-colors"
            style={{ fontWeight: 700, fontStretch: '72%' }}
            aria-label="View shopping bag"
          >
            <span>Bag</span>
            <span className="w-[1.25rem] h-[1.25rem] rounded-full bg-[#ef4a23] text-white text-[0.8rem] flex items-center justify-center font-bold">
              {totalCount}
            </span>
          </button>
        )}
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

        <Link
          to={user ? "/dashboard" : "/login"}
          className={`flex flex-col items-center gap-0.5 text-[0.7rem] font-archivo uppercase font-bold tracking-wider ${
            location.pathname === '/login' || location.pathname === '/dashboard' ? 'text-[#ef4a23]' : 'text-[#141110]/70'
          }`}
        >
          <span className="text-base leading-none">👤</span>
          <span>{user ? 'Account' : 'Login'}</span>
        </Link>

        {!isHome && (
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
        )}
      </div>
    </nav>
  );
};
