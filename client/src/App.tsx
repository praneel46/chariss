import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BagProvider } from './context/BagContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Home } from './pages/Home';
import { Discover } from './pages/Discover';
import { Occasions } from './pages/Occasions';
import { GiftStudio } from './pages/GiftStudio';
import { Consultation } from './pages/Consultation';
import { Recommendations } from './pages/Recommendations';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BagProvider>
          <WishlistProvider>
            <Routes>
              <Route element={<MainLayout />}>
                {/* Public Browsing Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/occasions" element={<Occasions />} />
                <Route path="/gift-studio" element={<GiftStudio />} />
                <Route path="/consultation" element={<Consultation />} />
                <Route path="/recommendations" element={<Recommendations />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Login />} />

                {/* Authenticated-Only Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </BagProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
