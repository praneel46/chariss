import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnnouncementBar } from '../components/common/AnnouncementBar';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { BagDrawer } from '../components/common/BagDrawer';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className={`min-h-screen flex flex-col ${isHome ? 'bg-[var(--page,#faf3e4)]' : 'bg-[#FAF9F6] text-[#292820]'}`}>
      {!isHome && <AnnouncementBar />}
      {!isHome && <Navbar />}
      <div className="flex-1">
        <Outlet />
      </div>
      <BagDrawer />
      {!isHome && <Footer />}
    </div>
  );
};
