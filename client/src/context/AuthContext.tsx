import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  savedSessions: SavedConsultationSession[];
  saveSession: (session: Omit<SavedConsultationSession, 'id' | 'date'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('charis_user');
      return saved ? JSON.parse(saved) : {
        id: 'usr-default-01',
        name: 'Praneel Kulkarni',
        email: 'praneel@example.com',
        role: 'user',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      };
    } catch {
      return null;
    }
  });

  const [savedSessions, setSavedSessions] = useState<SavedConsultationSession[]>(() => {
    try {
      const saved = localStorage.getItem('charis_saved_sessions');
      return saved ? JSON.parse(saved) : [
        {
          id: 'sess-01',
          date: '2026-11-10',
          recipientName: 'Eleanor',
          relationship: 'Partner',
          occasion: 'Anniversary',
          desiredEmotion: 'Tender Romance',
          budgetFormatted: '₹25,000 – ₹50,000',
          interests: ['Design', 'Smart Living', 'Biohacking'],
          chosenGiftName: 'Oura Ring 4 Biometric Horizon'
        },
        {
          id: 'sess-02',
          date: '2026-11-08',
          recipientName: 'Dev',
          relationship: 'Best Friend',
          occasion: 'Milestone Birthday',
          desiredEmotion: 'Joyous Breakthrough',
          budgetFormatted: '₹15,000 – ₹35,000',
          interests: ['Photography', 'Music', 'Tech'],
          chosenGiftName: 'Ray-Ban Meta Smart Glasses (Gen 2)'
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('charis_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('charis_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('charis_saved_sessions', JSON.stringify(savedSessions));
  }, [savedSessions]);

  const login = async (email: string, _password = ''): Promise<boolean> => {
    // Demo authentication saves user profile to local state and persists across page reloads
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role: 'user',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`
    };
    setUser(newUser);
    return true;
  };

  const register = async (name: string, email: string, _password = ''): Promise<boolean> => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name,
      email,
      role: 'user',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const saveSession = (session: Omit<SavedConsultationSession, 'id' | 'date'>) => {
    const newSession: SavedConsultationSession = {
      ...session,
      id: 'sess-' + Date.now(),
      date: new Date().toISOString().slice(0, 10)
    };
    setSavedSessions(prev => [newSession, ...prev]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        savedSessions,
        saveSession
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
