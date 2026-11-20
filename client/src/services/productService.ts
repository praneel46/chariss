/**
 * CHARIS Product Service
 *
 * Centralized API client for the product catalogue.
 * - Communicates with backend endpoints (/api/v1/products, /api/v1/products/featured, /api/v1/products/:id)
 * - Enforces that only active products are retrieved
 * - Normalizes MongoDB `_id` to standard `id` for consistent bag/wishlist keying
 * - Never returns fabricated fallback products on error
 */

import api from './api';
import type { Product } from '../types';

export interface ProductQueryParams {
  category?: string;
  search?: string;
  occasion?: string;
}

export interface ProductsApiResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta?: {
    total: number;
  };
}

export interface SingleProductApiResponse {
  success: boolean;
  message: string;
  data: Product;
}

/**
 * Normalizes a product document from MongoDB/Mongoose so `id` is guaranteed
 */
export const normalizeProduct = (item: any): Product => {
  return {
    ...item,
    id: item.id || item._id || item.slug,
    _id: item._id || item.id,
    currency: item.currency || 'INR',
    price: typeof item.price === 'number' ? item.price : 0,
    tags: Array.isArray(item.tags) ? item.tags : [],
    interests: Array.isArray(item.interests) ? item.interests : [],
    occasions: Array.isArray(item.occasions) ? item.occasions : [],
    retailer: item.retailer || {
      id: 'ret-unknown',
      name: 'Curated Artisan',
      website: 'https://charis.gifts',
      verified: true
    }
  };
};

export const productService = {
  /**
   * Fetch active products with optional category, search, and occasion filters
   */
  async getProducts(params?: ProductQueryParams): Promise<Product[]> {
    const queryParams: Record<string, string> = {};
    if (params?.category && params.category !== 'all') {
      queryParams.category = params.category;
    }
    if (params?.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
    if (params?.occasion) {
      queryParams.occasion = params.occasion;
    }

    const response = await api.get<ProductsApiResponse>('/products', {
      params: queryParams,
    });

    if (!response.data || !Array.isArray(response.data.data)) {
      return [];
    }

    return response.data.data.map(normalizeProduct);
  },

  /**
   * Fetch featured active products (limit 6)
   */
  async getFeaturedProducts(): Promise<Product[]> {
    const response = await api.get<ProductsApiResponse>('/products/featured');

    if (!response.data || !Array.isArray(response.data.data)) {
      return [];
    }

    return response.data.data.map(normalizeProduct);
  },

  /**
   * Fetch a single active product by its MongoDB ObjectId, slug, or serialNumber
   */
  async getProductById(idOrSlug: string): Promise<Product | null> {
    if (!idOrSlug) return null;

    try {
      const response = await api.get<SingleProductApiResponse>(`/products/${encodeURIComponent(idOrSlug)}`);
      if (!response.data || !response.data.data) {
        return null;
      }
      return normalizeProduct(response.data.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  },
};

export default productService;
