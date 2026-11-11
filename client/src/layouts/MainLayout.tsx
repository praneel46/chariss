import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from '../components/common/AnnouncementBar';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { BagDrawer } from '../components/common/BagDrawer';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#292820]">
      <AnnouncementBar />
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <BagDrawer />
      <Footer />
    </div>
  );
};
