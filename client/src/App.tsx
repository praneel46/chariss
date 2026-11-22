import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from './config/api';
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
  // Proactively ping backend to keep Render warm and awake
  useEffect(() => {
    const backendBase = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
    const pingBackend = () => {
      axios.get(`${backendBase}/health`).catch(() => {});
    };
    pingBackend();
    const interval = setInterval(pingBackend, 10 * 60 * 1000); // every 10 minutes
    return () => clearInterval(interval);
  }, []);

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
