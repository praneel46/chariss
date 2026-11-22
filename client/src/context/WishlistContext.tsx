import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { Product } from '../types';
import { bagAndWishlistService } from '../services/bagAndWishlistService';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (productOrId: Product | string) => Promise<void>;
  isWishlisted: (productOrId: Product | string) => boolean;
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

  const wishlistMutationSeqRef = useRef<number>(0);

  const loadConsultationWishlist = useCallback(
    async (consultationId: string | null) => {
      const currentSeq = ++wishlistMutationSeqRef.current;
      if (!consultationId) {
        if (user?.id) {
          try {
            const res = await bagAndWishlistService.getUserWishlist();
            if (wishlistMutationSeqRef.current !== currentSeq) return;
            if (res && Array.isArray(res.wishlist)) {
              setWishlist((prev) => (res.wishlist.length === 0 && prev.length > 0 ? prev : res.wishlist));
              localStorage.setItem(`charis_wishlist_u_${user.id}`, JSON.stringify(res.wishlist));
            }
          } catch (err) {
            console.warn('[WishlistContext] Account wishlist fetch error:', err);
          }
        } else {
          try {
            const saved = localStorage.getItem('charis_wishlist_guest_global');
            const parsed = saved ? JSON.parse(saved) : [];
            setWishlist((prev) => (parsed.length === 0 && prev.length > 0 ? prev : parsed));
          } catch {
            // ignore
          }
        }
        return;
      }

      // Try loading from scoped localStorage first for instantaneous optimistic UI
      try {
        const localKey = getStorageKey(consultationId);
        const saved = localStorage.getItem(localKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setWishlist(parsed);
          }
        }
      } catch {
        // ignore
      }

      // Fetch live backend wishlist
      try {
        const response = await bagAndWishlistService.getWishlist(consultationId);
        if (wishlistMutationSeqRef.current !== currentSeq) return;
        if (response && Array.isArray(response.wishlist)) {
          setWishlist((prev) => (response.wishlist.length === 0 && prev.length > 0 ? prev : response.wishlist));
          if (response.wishlist.length > 0) {
            const localKey = getStorageKey(consultationId);
            localStorage.setItem(localKey, JSON.stringify(response.wishlist));
          }
        }
      } catch (err) {
        console.warn('[WishlistContext] Live wishlist fetch warning:', err);
      }
    },
    [user?.id, getStorageKey]
  );

  const refreshWishlist = useCallback(async () => {
    const currentSeq = ++wishlistMutationSeqRef.current;
    if (user?.id) {
      try {
        const res = await bagAndWishlistService.getUserWishlist();
        if (wishlistMutationSeqRef.current !== currentSeq) return;
        if (res && Array.isArray(res.wishlist)) {
          setWishlist((prev) => (res.wishlist.length === 0 && prev.length > 0 ? prev : res.wishlist));
          localStorage.setItem(`charis_wishlist_u_${user.id}`, JSON.stringify(res.wishlist));
        }
      } catch (err) {
        console.warn('[WishlistContext] Refresh wishlist error:', err);
      }
    } else if (activeConsultationId) {
      await loadConsultationWishlist(activeConsultationId);
    }
  }, [user?.id, activeConsultationId, loadConsultationWishlist]);

  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  // Synchronize wishlist when user identity changes (login, logout, account switch)
  useEffect(() => {
    let isMounted = true;

    // Initial mount: preserve existing wishlist (don't clear guest wishlist!)
    if (prevUserIdRef.current === undefined) {
      prevUserIdRef.current = user?.id || null;
      return;
    }

    // Only if a previously authenticated user explicitly logged out
    if (prevUserIdRef.current && !user?.id) {
      prevUserIdRef.current = null;
      try {
        const guestSaved = localStorage.getItem('charis_wishlist_guest_global');
        setWishlist(guestSaved ? JSON.parse(guestSaved) : []);
      } catch {
        setWishlist([]);
      }
      setActiveConsultationIdState(null);
      return;
    }

    prevUserIdRef.current = user?.id || null;
    if (!user) return;

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

        const currentSeq = ++wishlistMutationSeqRef.current;
        const res = await bagAndWishlistService.getUserWishlist();
        if (wishlistMutationSeqRef.current !== currentSeq) return;
        if (isMounted && res && Array.isArray(res.wishlist)) {
          setWishlist((prev) => (res.wishlist.length === 0 && prev.length > 0 ? prev : res.wishlist));
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
    } else {
      localStorage.removeItem('charis_active_consultation_id');
    }
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
    wishlistMutationSeqRef.current += 1;
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
        } else {
          localStorage.setItem('charis_wishlist_guest_global', JSON.stringify(nextWishlist));
        }
      } catch {
        // ignore
      }
      return nextWishlist;
    });

    try {
      const res = await bagAndWishlistService.toggleWishlist(activeConsultationId, product);
      if (res && Array.isArray(res.wishlist)) {
        setWishlist((current) => {
          const serverSet = new Set(res.wishlist);
          const currentSet = new Set(current);
          const isSame =
            serverSet.size === currentSet.size &&
            [...serverSet].every((id) => currentSet.has(id));
          if (isSame) return current;
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
  };

  const isWishlisted = useCallback(
    (productOrId: Product | string) => {
      if (!productOrId) return false;
      const targetId = typeof productOrId === 'string' ? productOrId : productOrId.id;
      const targetMongoId = typeof productOrId === 'object' ? (productOrId as any)._id : undefined;
      const targetSlug = typeof productOrId === 'object' ? productOrId.slug : undefined;

      return (
        (Boolean(targetId) && wishlist.includes(targetId)) ||
        (Boolean(targetMongoId) && wishlist.includes(targetMongoId!)) ||
        (Boolean(targetSlug) && wishlist.includes(targetSlug!))
      );
    },
    [wishlist]
  );

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
