import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';
import { useBag } from '../../context/BagContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalCount, setIsBagOpen } = useBag();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Discover', path: '/discover' },
    { label: 'Occasions', path: '/occasions' },
    { label: 'Gift Studio', path: '/gift-studio' },
    { label: 'How It Works', path: '/#how-it-works' },
  ];

  const isActive = (path: string) => {
    if (path.startsWith('/#')) return false;
    return location.pathname === path;
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF9F6]/90 backdrop-blur-md shadow-xs border-b border-[#292820]/8 py-3'
          : 'bg-[#FAF9F6] border-b border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#292820] group-hover:text-[#B69A78] transition-colors">
              charis<span className="text-[#B69A78]">.</span>
            </span>
            <span className="hidden md:inline-block text-[10px] uppercase font-mono tracking-widest text-[#292820]/60 pl-2 border-l border-[#292820]/20">
              Personalized Gifting
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1 transition-colors text-xs uppercase tracking-widest ${
                    active
                      ? 'text-[#292820] font-semibold'
                      : 'text-[#292820]/75 hover:text-[#292820]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4A359] ml-1.5 align-middle" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Bag Button */}
            <button
              onClick={() => setIsBagOpen(true)}
              aria-label="View shopping bag"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EDE5DA]/60 hover:bg-[#EDE5DA] transition-all border border-[#292820]/10 text-xs font-medium cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#292820]" />
              <span className="hidden sm:inline text-xs text-[#292820]">Bag</span>
              <span className="w-5 h-5 rounded-full bg-[#D4A359] text-[#151419] font-bold text-[11px] flex items-center justify-center">
                {totalCount}
              </span>
            </button>

            {/* AI Consultation Primary CTA */}
            <Link
              to="/consultation"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#151419] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#292820] transition-all shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4A359]" />
              <span>AI Consult</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 text-[#292820] hover:bg-[#EDE5DA] rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#292820]/10 bg-[#FAF9F6] px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-base font-medium py-2 px-3 rounded-md hover:bg-[#EDE5DA]/50 text-[#292820] flex items-center justify-between"
              >
                <span>{link.label}</span>
                {isActive(link.path) && (
                  <span className="w-2 h-2 rounded-full bg-[#D4A359]" />
                )}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-[#292820]/10">
            <Link
              to="/consultation"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-[#151419] text-[#FAF9F6] text-sm font-semibold uppercase tracking-wider shadow-brutal"
            >
              <Sparkles className="w-4 h-4 text-[#D4A359]" />
              <span>Start AI Consultation</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
