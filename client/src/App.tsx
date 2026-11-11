import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BagProvider } from './context/BagContext';
import { WishlistProvider } from './context/WishlistContext';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Discover } from './pages/Discover';
import { Occasions } from './pages/Occasions';
import { GiftStudio } from './pages/GiftStudio';
import { Consultation } from './pages/Consultation';
import { Recommendations } from './pages/Recommendations';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <BagProvider>
        <WishlistProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/occasions" element={<Occasions />} />
              <Route path="/gift-studio" element={<GiftStudio />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </WishlistProvider>
      </BagProvider>
    </BrowserRouter>
  );
};

export default App;
