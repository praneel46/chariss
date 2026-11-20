import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product } from '../types';
import { bagAndWishlistService } from '../services/bagAndWishlistService';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (productOrId: Product | string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  activeConsultationId: string | null;
  setActiveConsultationId: (id: string | null) => void;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [activeConsultationId, setActiveConsultationIdState] = useState<string | null>(() => {
    try {
      return localStorage.getItem('charis_active_consultation_id') || null;
    } catch {
      return null;
    }
  });

  const getStorageKey = useCallback(
    (consultationId: string | null) => {
      if (user?.id) {
        return consultationId
          ? `charis_wishlist_u_${user.id}_${consultationId}`
          : `charis_wishlist_u_${user.id}`;
      }
      return consultationId
        ? `charis_wishlist_guest_${consultationId}`
        : 'charis_wishlist_guest_global';
    },
    [user?.id]
  );

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      if (user?.id) {
        const userKey = `charis_wishlist_u_${user.id}`;
        const saved = localStorage.getItem(userKey);
        return saved ? JSON.parse(saved) : [];
      }
      const guestSaved = localStorage.getItem('charis_wishlist_guest_global');
      return guestSaved ? JSON.parse(guestSaved) : [];
    } catch {
      return [];
    }
  });

  const loadConsultationWishlist = useCallback(
    async (consultationId: string | null) => {
      if (!consultationId) {
        if (user?.id) {
          try {
            const res = await bagAndWishlistService.getUserWishlist();
            if (res && Array.isArray(res.wishlist)) {
              setWishlist(res.wishlist);
              localStorage.setItem(`charis_wishlist_u_${user.id}`, JSON.stringify(res.wishlist));
            }
          } catch (err) {
            console.warn('[WishlistContext] Account wishlist fetch error:', err);
          }
        } else {
          try {
            const saved = localStorage.getItem('charis_wishlist_guest_global');
            setWishlist(saved ? JSON.parse(saved) : []);
          } catch {
            setWishlist([]);
          }
        }
        return;
      }

      // Try loading from scoped localStorage first for instantaneous optimistic UI
      try {
        const localKey = getStorageKey(consultationId);
        const saved = localStorage.getItem(localKey);
        if (saved) {
          setWishlist(JSON.parse(saved));
        }
      } catch {
        // ignore
      }

      // Fetch live backend wishlist
      try {
        const response = await bagAndWishlistService.getWishlist(consultationId);
        if (response && Array.isArray(response.wishlist)) {
          setWishlist(response.wishlist);
          const localKey = getStorageKey(consultationId);
          localStorage.setItem(localKey, JSON.stringify(response.wishlist));
        }
      } catch (err) {
        console.warn('[WishlistContext] Live wishlist fetch warning:', err);
      }
    },
    [user?.id, getStorageKey]
  );

  const refreshWishlist = useCallback(async () => {
    if (user?.id) {
      try {
        const res = await bagAndWishlistService.getUserWishlist();
        if (res && Array.isArray(res.wishlist)) {
          setWishlist(res.wishlist);
          localStorage.setItem(`charis_wishlist_u_${user.id}`, JSON.stringify(res.wishlist));
        }
      } catch (err) {
        console.warn('[WishlistContext] Refresh wishlist error:', err);
      }
    } else if (activeConsultationId) {
      await loadConsultationWishlist(activeConsultationId);
    } else {
      setWishlist([]);
    }
  }, [user?.id, activeConsultationId, loadConsultationWishlist]);

  // Synchronize wishlist when user identity changes (login, logout, account switch)
  useEffect(() => {
    let isMounted = true;

    if (!user) {
      // User logged out: immediately purge in-memory wishlist
      setWishlist([]);
      setActiveConsultationIdState(null);
      return;
    }

    // Authenticated user: load user's isolated account wishlist
    const fetchUserWishlist = async () => {
      try {
        const userKey = `charis_wishlist_u_${user.id}`;
        const saved = localStorage.getItem(userKey);
        if (saved && isMounted) {
          try {
            setWishlist(JSON.parse(saved));
          } catch {
            // ignore
          }
        }

        const res = await bagAndWishlistService.getUserWishlist();
        if (isMounted && res && Array.isArray(res.wishlist)) {
          setWishlist(res.wishlist);
          localStorage.setItem(userKey, JSON.stringify(res.wishlist));
        }
      } catch (err) {
        console.warn('[WishlistContext] User account wishlist load error:', err);
      }
    };

    fetchUserWishlist();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const setActiveConsultationId = (id: string | null) => {
    setActiveConsultationIdState(id);
    if (id) {
      localStorage.setItem('charis_active_consultation_id', id);
    }
    loadConsultationWishlist(id);
  };

  useEffect(() => {
    if (activeConsultationId) {
      loadConsultationWishlist(activeConsultationId);
    }
  }, [activeConsultationId, loadConsultationWishlist]);

  // Sync to user/guest-scoped local storage
  useEffect(() => {
    try {
      const key = getStorageKey(activeConsultationId);
      localStorage.setItem(key, JSON.stringify(wishlist));
      if (user?.id) {
        localStorage.setItem(`charis_wishlist_u_${user.id}`, JSON.stringify(wishlist));
      }
    } catch {
      // ignore
    }
  }, [wishlist, activeConsultationId, getStorageKey, user?.id]);

  const toggleWishlist = async (productOrId: Product | string) => {
    const productId = typeof productOrId === 'string' ? productOrId : productOrId.id;
    const product = typeof productOrId === 'string' ? ({ id: productId } as Product) : productOrId;

    // Optimistic update — instant UI response, no flicker
    let nextWishlist: string[] = [];
    setWishlist((prev) => {
      nextWishlist = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      try {
        const key = getStorageKey(activeConsultationId);
        localStorage.setItem(key, JSON.stringify(nextWishlist));
        if (user?.id) {
          localStorage.setItem(`charis_wishlist_u_${user.id}`, JSON.stringify(nextWishlist));
        }
      } catch {
        // ignore
      }
      return nextWishlist;
    });

    if (activeConsultationId) {
      try {
        const res = await bagAndWishlistService.toggleWishlist(activeConsultationId, product);
        if (res && Array.isArray(res.wishlist)) {
          // Only update if server state differs from optimistic (avoid double-render flicker)
          setWishlist((current) => {
            const serverSet = new Set(res.wishlist);
            const currentSet = new Set(current);
            const isSame =
              serverSet.size === currentSet.size &&
              [...serverSet].every((id) => currentSet.has(id));
            if (isSame) return current; // no-op — prevents re-render flicker
            const key = getStorageKey(activeConsultationId);
            localStorage.setItem(key, JSON.stringify(res.wishlist));
            if (user?.id) {
              localStorage.setItem(`charis_wishlist_u_${user.id}`, JSON.stringify(res.wishlist));
            }
            return res.wishlist;
          });
        }
      } catch (err) {
        console.warn('[WishlistContext] Failed to sync toggleWishlist with backend:', err);
      }
    }
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isWishlisted,
        activeConsultationId,
        setActiveConsultationId,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
