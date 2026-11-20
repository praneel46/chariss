import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { KolibrieNav } from '../components/kolibrie/KolibrieNav';
import { KolibrieFooter } from '../components/kolibrie/KolibrieFooter';
import { AtelierAndFooterModals, type ModalType } from '../components/kolibrie/AtelierAndFooterModals';
import { BagDrawer } from '../components/common/BagDrawer';
import { CursorMarquee } from '../components/kolibrie/CursorMarquee';
import { AmbientMusicPlayer } from '../components/common/AmbientMusicPlayer';
import { useAuth } from '../context/AuthContext';

export const MainLayout: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleOpenAtelier = () => setActiveModal('ateliers');
    document.addEventListener('open:atelier-modal', handleOpenAtelier);
    return () => document.removeEventListener('open:atelier-modal', handleOpenAtelier);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf3e4] text-[#141110] font-archivo selection:bg-[#ef4a23] selection:text-white">
      {/* Universal Kolibrie Fixed Header */}
      <KolibrieNav />

      {/* Universal Cursor Marquee */}
      <CursorMarquee />

      {/* Main Content Area */}
      <div className="flex-1 w-full">
        <Outlet />
      </div>

      {/* Ambient Lo-Fi Beats Player (Floating) */}
      <AmbientMusicPlayer />

      {/* Universal Interactive Kolibrie Footer with 4 Pillars & Ateliers (Hidden for authenticated members) */}
      {!isAuthenticated && (
        <KolibrieFooter onOpenModal={(type) => setActiveModal(type)} />
      )}

      {/* Shopping Bag Drawer */}
      <BagDrawer />

      {/* Interactive Modal Drawers */}
      <AtelierAndFooterModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
};
