import { api } from './api';
import type { Product } from '../types';

export interface BagApiResponse {
  success: boolean;
  consultationId: string;
  items: Array<{
    _id?: string;
    productId: string;
    product: Product;
    quantity: number;
    selected: boolean;
    addedAt?: string;
  }>;
  totalCount: number;
  totalAmount: number;
}

export interface WishlistApiResponse {
  success: boolean;
  consultationId: string;
  wishlist: string[];
  items?: Array<{
    productId: string;
    product?: Product;
    addedAt?: string;
  }>;
}

export interface UserBagApiResponse {
  success: boolean;
  userId: string;
  items: Array<{
    _id?: string;
    consultationId?: string;
    productId: string;
    product: Product;
    quantity: number;
    selected: boolean;
    addedAt?: string;
  }>;
  totalCount: number;
  totalAmount: number;
}

export interface UserWishlistApiResponse {
  success: boolean;
  userId: string;
  wishlist: string[];
  items?: Array<{
    productId: string;
    product?: Product;
    consultationId?: string;
    addedAt?: string;
  }>;
}

export const bagAndWishlistService = {
  // ==================== GIFT BAG ====================
  async getUserBag(): Promise<UserBagApiResponse> {
    const res = await api.get<UserBagApiResponse>('/consultations/account/bag');
    return res.data;
  },

  async getBag(consultationId: string): Promise<BagApiResponse> {
    const res = await api.get<BagApiResponse>(`/consultations/${consultationId}/bag`);
    return res.data;
  },

  async addToBag(
    consultationId: string | null | undefined,
    product: Product,
    quantity = 1,
    selected = true
  ): Promise<BagApiResponse> {
    const isObjectId = Boolean(consultationId && /^[0-9a-fA-F]{24}$/.test(consultationId));
    const endpoint = isObjectId
      ? `/consultations/${consultationId}/bag`
      : '/consultations/account/bag';

    const res = await api.post(endpoint, {
      productId: product.id,
      product,
      quantity,
      selected,
      consultationId: isObjectId ? consultationId : undefined,
    });
    return res.data;
  },

  async updateBagItem(
    consultationId: string | null | undefined,
    productId: string,
    data: { quantity?: number; selected?: boolean }
  ): Promise<BagApiResponse> {
    const isObjectId = Boolean(consultationId && /^[0-9a-fA-F]{24}$/.test(consultationId));
    const endpoint = isObjectId
      ? `/consultations/${consultationId}/bag/${productId}`
      : `/consultations/account/bag/${productId}`;

    const res = await api.patch(endpoint, data);
    return res.data;
  },

  async removeFromBag(
    consultationId: string | null | undefined,
    productId: string
  ): Promise<BagApiResponse> {
    const isObjectId = Boolean(consultationId && /^[0-9a-fA-F]{24}$/.test(consultationId));
    const endpoint = isObjectId
      ? `/consultations/${consultationId}/bag/${productId}`
      : `/consultations/account/bag/${productId}`;

    const res = await api.delete(endpoint);
    return res.data;
  },

  async clearBag(consultationId: string | null | undefined): Promise<BagApiResponse> {
    const isObjectId = Boolean(consultationId && /^[0-9a-fA-F]{24}$/.test(consultationId));
    const endpoint = isObjectId
      ? `/consultations/${consultationId}/bag`
      : '/consultations/account/bag';

    const res = await api.delete(endpoint);
    return res.data;
  },

  async checkout(
    consultationId: string,
    productIds?: string[]
  ): Promise<{
    success: boolean;
    consultationId: string;
    checkoutItems: Array<{
      productId: string;
      name: string;
      retailerName: string;
      retailerWebsite: string;
      verified: boolean;
      checkoutUrl: string;
      quantity: number;
      price: number;
      total: number;
    }>;
    totalAmount: number;
    itemCount: number;
  }> {
    const res = await api.post(`/consultations/${consultationId}/bag/checkout`, {
      productIds,
    });
    return res.data;
  },

  // ==================== WISHLIST ====================
  async getUserWishlist(): Promise<UserWishlistApiResponse> {
    const res = await api.get<UserWishlistApiResponse>('/consultations/account/wishlist');
    return res.data;
  },

  async getWishlist(consultationId: string): Promise<WishlistApiResponse> {
    const res = await api.get<WishlistApiResponse>(`/consultations/${consultationId}/wishlist`);
    return res.data;
  },

  async toggleWishlist(
    consultationId: string | null | undefined,
    product: Product
  ): Promise<{ success: boolean; wishlisted: boolean; wishlist: string[] }> {
    const isObjectId = Boolean(consultationId && /^[0-9a-fA-F]{24}$/.test(consultationId));
    const endpoint = isObjectId
      ? `/consultations/${consultationId}/wishlist`
      : '/consultations/account/wishlist';

    const res = await api.post(endpoint, {
      productId: product.id,
      product,
      consultationId: isObjectId ? consultationId : undefined,
    });
    return res.data;
  },

  async removeFromWishlist(
    consultationId: string | null | undefined,
    productId: string
  ): Promise<{ success: boolean; wishlist: string[] }> {
    const isObjectId = Boolean(consultationId && /^[0-9a-fA-F]{24}$/.test(consultationId));
    const endpoint = isObjectId
      ? `/consultations/${consultationId}/wishlist/${productId}`
      : `/consultations/account/wishlist/${productId}`;

    const res = await api.delete(endpoint);
    return res.data;
  },
};
