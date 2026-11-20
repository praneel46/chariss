import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: 'user' | 'admin';
  createdAt?: string;
}

export interface SavedConsultationSession {
  id: string;
  date: string;
  recipientName: string;
  relationship: string;
  occasion: string;
  desiredEmotion: string;
  budgetFormatted: string;
  interests: string[];
  chosenGiftId?: string;
  chosenGiftName?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  savedSessions: SavedConsultationSession[];
  saveSession: (session: Omit<SavedConsultationSession, 'id' | 'date'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [savedSessions, setSavedSessions] = useState<SavedConsultationSession[]>([]);

  // 1. Session Restoration on Application Startup (GET /api/v1/auth/me)
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Load and persist user-specific saved consultation sessions
  useEffect(() => {
    if (user?.email) {
      try {
        const userKey = `charis_saved_sessions_${user.email.toLowerCase()}`;
        const saved = localStorage.getItem(userKey);
        if (saved) {
          setSavedSessions(JSON.parse(saved));
        } else {
          setSavedSessions([]);
        }
      } catch {
        setSavedSessions([]);
      }
    } else {
      setSavedSessions([]);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email && savedSessions.length > 0) {
      const userKey = `charis_saved_sessions_${user.email.toLowerCase()}`;
      localStorage.setItem(userKey, JSON.stringify(savedSessions));
    }
  }, [savedSessions, user?.email]);

  // 3. Authentication Operations
  const login = async (email: string, password: string = ''): Promise<boolean> => {
    try {
      const authenticatedUser = await authService.login(email, password);
      setUser(authenticatedUser);
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        (error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(', ') : null) ||
        error.message ||
        'Login failed';
      throw new Error(message);
    }
  };

  const register = async (name: string, email: string, password: string = ''): Promise<boolean> => {
    try {
      const newUser = await authService.register(name, email, password);
      setUser(newUser);
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        (error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(', ') : null) ||
        error.message ||
        'Registration failed';
      throw new Error(message);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('[CHARIS Auth] Logout request error:', error);
    } finally {
      setUser(null);
      try {
        localStorage.removeItem('charis_active_consultation');
        localStorage.removeItem('charis_active_consultation_id');
        localStorage.removeItem('charis_wishlist');
        localStorage.removeItem('charis_wishlist_global');
        localStorage.removeItem('charis_bag');
        localStorage.removeItem('charis_bag_global');
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (
            key &&
            (key.startsWith('charis_wishlist') ||
              key.startsWith('charis_bag') ||
              key.startsWith('charis_active'))
          ) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch {
        // Safe fallback if localStorage is unavailable
      }
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    try {
      await authService.refreshSession();
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return true;
    } catch {
      setUser(null);
      return false;
    }
  };

  const saveSession = (session: Omit<SavedConsultationSession, 'id' | 'date'>) => {
    const newSession: SavedConsultationSession = {
      ...session,
      id: 'sess-' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
    };
    setSavedSessions((prev) => [newSession, ...prev]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshSession,
        savedSessions,
        saveSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
