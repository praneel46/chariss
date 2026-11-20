import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, BagItem } from '../types';
import { bagAndWishlistService } from '../services/bagAndWishlistService';
import { useAuth } from './AuthContext';

interface BagContextType {
  items: BagItem[];
  addToBag: (product: Product, quantity?: number) => Promise<void>;
  removeFromBag: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearBag: () => Promise<void>;
  totalCount: number;
  totalAmount: number;
  isBagOpen: boolean;
  setIsBagOpen: (open: boolean) => void;
  // Consultation isolation
  activeConsultationId: string | null;
  setActiveConsultationId: (id: string | null) => void;
  // Checkbox checkout selection
  selectedProductIds: string[];
  toggleSelectProduct: (productId: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  isSelected: (productId: string) => boolean;
  selectedCount: number;
  selectedAmount: number;
  selectedItems: BagItem[];
  refreshBag: () => Promise<void>;
}

const BagContext = createContext<BagContextType | undefined>(undefined);

export const BagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
          ? `charis_bag_u_${user.id}_${consultationId}`
          : `charis_bag_u_${user.id}`;
      }
      return consultationId
        ? `charis_bag_guest_${consultationId}`
        : 'charis_bag_guest_global';
    },
    [user?.id]
  );

  const [items, setItems] = useState<BagItem[]>(() => {
    try {
      if (user?.id) {
        const userKey = `charis_bag_u_${user.id}`;
        const saved = localStorage.getItem(userKey);
        return saved ? JSON.parse(saved) : [];
      }
      const guestSaved = localStorage.getItem('charis_bag_guest_global');
      return guestSaved ? JSON.parse(guestSaved) : [];
    } catch {
      return [];
    }
  });

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(() => {
    return items.map((it) => it.product.id);
  });

  const [isBagOpen, setIsBagOpen] = useState(false);

  // Load bag whenever active consultation or user identity changes
  const loadConsultationBag = useCallback(
    async (consultationId: string | null) => {
      if (!consultationId) {
        if (user?.id) {
          try {
            const res = await bagAndWishlistService.getUserBag();
            if (res && Array.isArray(res.items)) {
              const mapped: BagItem[] = res.items.map((i) => ({
                product: i.product,
                quantity: i.quantity,
              }));
              setItems(mapped);
              setSelectedProductIds(
                res.items.filter((i) => i.selected !== false).map((i) => i.productId)
              );
              localStorage.setItem(`charis_bag_u_${user.id}`, JSON.stringify(mapped));
            }
          } catch (err) {
            console.warn('[BagContext] User bag fetch error:', err);
          }
        } else {
          try {
            const saved = localStorage.getItem('charis_bag_guest_global');
            const parsed: BagItem[] = saved ? JSON.parse(saved) : [];
            setItems(parsed);
            setSelectedProductIds(parsed.map((p) => p.product.id));
          } catch {
            setItems([]);
            setSelectedProductIds([]);
          }
        }
        return;
      }

      // Try loading from scoped localStorage first for instantaneous optimistic UI
      try {
        const localKey = getStorageKey(consultationId);
        const saved = localStorage.getItem(localKey);
        if (saved) {
          const parsed: BagItem[] = JSON.parse(saved);
          setItems(parsed);
          setSelectedProductIds(parsed.map((p) => p.product.id));
        }
      } catch {
        // ignore
      }

      // Fetch live backend bag
      try {
        const response = await bagAndWishlistService.getBag(consultationId);
        if (response && response.items) {
          const mappedItems: BagItem[] = response.items.map((i) => ({
            product: i.product,
            quantity: i.quantity,
          }));
          setItems(mappedItems);
          const selected = response.items
            .filter((i) => i.selected !== false)
            .map((i) => i.productId);
          setSelectedProductIds(selected);
          const localKey = getStorageKey(consultationId);
          localStorage.setItem(localKey, JSON.stringify(mappedItems));
        }
      } catch (err) {
        console.warn('[BagContext] Live bag fetch warning:', err);
      }
    },
    [user?.id, getStorageKey]
  );

  const refreshBag = useCallback(async () => {
    if (user?.id) {
      try {
        const res = await bagAndWishlistService.getUserBag();
        if (res && Array.isArray(res.items)) {
          const mapped: BagItem[] = res.items.map((i) => ({
            product: i.product,
            quantity: i.quantity,
          }));
          setItems(mapped);
          setSelectedProductIds(
            res.items.filter((i) => i.selected !== false).map((i) => i.productId)
          );
          localStorage.setItem(`charis_bag_u_${user.id}`, JSON.stringify(mapped));
        }
      } catch (err) {
        console.warn('[BagContext] Refresh bag error:', err);
      }
    } else if (activeConsultationId) {
      await loadConsultationBag(activeConsultationId);
    } else {
      setItems([]);
      setSelectedProductIds([]);
    }
  }, [user?.id, activeConsultationId, loadConsultationBag]);

  // Synchronize bag when user identity changes (login, logout, account switch)
  useEffect(() => {
    let isMounted = true;

    if (!user) {
      // User logged out: immediately clear bag state
      setItems([]);
      setSelectedProductIds([]);
      setActiveConsultationIdState(null);
      return;
    }

    // Authenticated user: load isolated user bag
    const fetchUserBag = async () => {
      try {
        const userKey = `charis_bag_u_${user.id}`;
        const saved = localStorage.getItem(userKey);
        if (saved && isMounted) {
          try {
            const parsed: BagItem[] = JSON.parse(saved);
            setItems(parsed);
            setSelectedProductIds(parsed.map((p) => p.product.id));
          } catch {
            // ignore
          }
        }

        const res = await bagAndWishlistService.getUserBag();
        if (isMounted && res && Array.isArray(res.items)) {
          const mapped: BagItem[] = res.items.map((i) => ({
            product: i.product,
            quantity: i.quantity,
          }));
          setItems(mapped);
          setSelectedProductIds(
            res.items.filter((i) => i.selected !== false).map((i) => i.productId)
          );
          localStorage.setItem(userKey, JSON.stringify(mapped));
        }
      } catch (err) {
        console.warn('[BagContext] User bag sync error:', err);
      }
    };

    fetchUserBag();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const setActiveConsultationId = (id: string | null) => {
    setActiveConsultationIdState(id);
    if (id) {
      localStorage.setItem('charis_active_consultation_id', id);
    }
    loadConsultationBag(id);
  };

  useEffect(() => {
    if (activeConsultationId) {
      loadConsultationBag(activeConsultationId);
    }
  }, [activeConsultationId, loadConsultationBag]);

  // Sync to user/guest scoped local storage
  useEffect(() => {
    try {
      const key = getStorageKey(activeConsultationId);
      localStorage.setItem(key, JSON.stringify(items));
      if (user?.id) {
        localStorage.setItem(`charis_bag_u_${user.id}`, JSON.stringify(items));
      }
    } catch {
      // ignore
    }
  }, [items, activeConsultationId, getStorageKey, user?.id]);

  // Keep selection synchronized when items change
  useEffect(() => {
    setSelectedProductIds((prev) => {
      const currentItemIds = new Set(items.map((it) => it.product.id));
      const filtered = prev.filter((id) => currentItemIds.has(id));
      // Auto-select newly added items
      items.forEach((it) => {
        if (!prev.includes(it.product.id) && !filtered.includes(it.product.id)) {
          filtered.push(it.product.id);
        }
      });
      return filtered;
    });
  }, [items]);

  const addToBag = async (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: BagItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updated = [...prev, { product, quantity }];
      }

      try {
        const key = getStorageKey(activeConsultationId);
        localStorage.setItem(key, JSON.stringify(updated));
        if (user?.id) {
          localStorage.setItem(`charis_bag_u_${user.id}`, JSON.stringify(updated));
        }
      } catch {
        // ignore
      }
      return updated;
    });

    setSelectedProductIds((prev) => (prev.includes(product.id) ? prev : [...prev, product.id]));
    setIsBagOpen(true);

    if (activeConsultationId) {
      try {
        await bagAndWishlistService.addToBag(activeConsultationId, product, quantity, true);
      } catch (err) {
        console.warn('[BagContext] Failed to sync addToBag with backend:', err);
      }
    }
  };

  const removeFromBag = async (productId: string) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      try {
        const key = getStorageKey(activeConsultationId);
        localStorage.setItem(key, JSON.stringify(updated));
        if (user?.id) {
          localStorage.setItem(`charis_bag_u_${user.id}`, JSON.stringify(updated));
        }
      } catch {
        // ignore
      }
      return updated;
    });
    setSelectedProductIds((prev) => prev.filter((id) => id !== productId));

    if (activeConsultationId) {
      try {
        await bagAndWishlistService.removeFromBag(activeConsultationId, productId);
      } catch (err) {
        console.warn('[BagContext] Failed to sync removeFromBag with backend:', err);
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromBag(productId);
      return;
    }

    setItems((prev) => {
      const updated = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      try {
        const key = getStorageKey(activeConsultationId);
        localStorage.setItem(key, JSON.stringify(updated));
        if (user?.id) {
          localStorage.setItem(`charis_bag_u_${user.id}`, JSON.stringify(updated));
        }
      } catch {
        // ignore
      }
      return updated;
    });

    if (activeConsultationId) {
      try {
        await bagAndWishlistService.updateBagItem(activeConsultationId, productId, { quantity });
      } catch (err) {
        console.warn('[BagContext] Failed to sync updateQuantity with backend:', err);
      }
    }
  };

  const clearBag = async () => {
    setItems([]);
    setSelectedProductIds([]);
    try {
      const key = getStorageKey(activeConsultationId);
      localStorage.removeItem(key);
      if (user?.id) {
        localStorage.removeItem(`charis_bag_u_${user.id}`);
      }
    } catch {
      // ignore
    }

    if (activeConsultationId) {
      try {
        await bagAndWishlistService.clearBag(activeConsultationId);
      } catch (err) {
        console.warn('[BagContext] Failed to sync clearBag with backend:', err);
      }
    }
  };

  // Selection toggles
  const toggleSelectProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const selectAll = () => {
    setSelectedProductIds(items.map((it) => it.product.id));
  };

  const clearSelection = () => {
    setSelectedProductIds([]);
  };

  const isSelected = (productId: string) => selectedProductIds.includes(productId);

  const selectedItems = items.filter((it) => selectedProductIds.includes(it.product.id));
  const selectedCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedAmount = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <BagContext.Provider
      value={{
        items,
        addToBag,
        removeFromBag,
        updateQuantity,
        clearBag,
        totalCount,
        totalAmount,
        isBagOpen,
        setIsBagOpen,
        activeConsultationId,
        setActiveConsultationId,
        selectedProductIds,
        toggleSelectProduct,
        selectAll,
        clearSelection,
        isSelected,
        selectedCount,
        selectedAmount,
        selectedItems,
        refreshBag,
      }}
    >
      {children}
    </BagContext.Provider>
  );
};

export const useBag = () => {
  const context = useContext(BagContext);
  if (!context) throw new Error('useBag must be used within a BagProvider');
  return context;
};
