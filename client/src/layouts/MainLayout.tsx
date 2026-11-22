import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { KolibrieNav } from '../components/kolibrie/KolibrieNav';
import { KolibrieFooter } from '../components/kolibrie/KolibrieFooter';
import { AtelierAndFooterModals, type ModalType } from '../components/kolibrie/AtelierAndFooterModals';
import { BagDrawer } from '../components/common/BagDrawer';
import { CursorMarquee } from '../components/kolibrie/CursorMarquee';
import { AmbientMusicPlayer } from '../components/common/AmbientMusicPlayer';
import { CinematicOpening } from '../components/home/CinematicOpening';
import { CurtainTransition } from '../components/common/CurtainTransition';

export const MainLayout: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleOpenAtelier = () => setActiveModal('ateliers');
    document.addEventListener('open:atelier-modal', handleOpenAtelier);
    return () => document.removeEventListener('open:atelier-modal', handleOpenAtelier);
  }, []);

  return (
    <div className="relative bg-[#141110] min-h-screen text-[#141110] font-archivo selection:bg-[#ef4a23] selection:text-white overflow-x-hidden">
      {/* Universal Kolibrie Fixed Header */}
      <KolibrieNav />

      {/* Universal Cursor Marquee */}
      <CursorMarquee />

      {/* Fixed Positioned Underneath 100vh Footer (Curtain reveal mechanism matching Kinya Coffee) - Always rendered for all visitors */}
      <div className="fixed bottom-0 left-0 right-0 z-0 w-full h-[100dvh] min-h-screen">
        <KolibrieFooter onOpenModal={(type) => setActiveModal(type)} />
      </div>

      {/* Main Elevated Parchment Card Container that peels up to reveal the full-height footer */}
      <div
        className="relative z-10 bg-[#faf3e4] rounded-b-[36px] sm:rounded-b-[60px] shadow-[0_30px_70px_rgba(20,17,16,0.38)] min-h-screen flex flex-col transition-[border-radius] duration-300"
        style={{
          marginBottom: '100dvh',
        }}
      >
        <div className="flex-1 w-full">
          {/* Section & Page Transition Curtain Animation */}
          <AnimatePresence mode="wait">
            <CurtainTransition key={location.pathname}>
              <Outlet />
            </CurtainTransition>
          </AnimatePresence>
        </div>

        {/* Bottom smooth bumper padding */}
        <div className="h-10 sm:h-16 w-full" />
      </div>

      {/* Single-Source Ambient Beats Player (Floating) */}
      <AmbientMusicPlayer />

      {/* Shopping Bag Drawer */}
      <BagDrawer />

      {/* Interactive Modal Drawers */}
      <AtelierAndFooterModals activeModal={activeModal} onClose={() => setActiveModal(null)} />

      {/* 3D Cinematic Gift Opening Introduction (Homepage) */}
      {isHome && <CinematicOpening />}
    </div>
  );
};

export default MainLayout;
