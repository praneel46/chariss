/**
 * CHARIS Consultation Service
 *
 * Centralized API client for AI Gift Consultations and grounded recommendations.
 * - Communicates with backend endpoints (/api/v1/consultations)
 * - Transparently handles authenticated sessions and HTTP-only guest session cookies
 * - Normalizes MongoDB `_id` to standard `id`
 * - Provides formatted date and budget helper properties for dashboard rendering
 * - Preserves existing Axios client and refresh interceptor
 */

import api from './api';
import type {
  Product,
  ConsultationBudget,
  CreateConsultationInput,
  ConsultationRecord,
  RankedRecommendationItem,
  GenerateRecommendationsResponse,
  RecommendationResult,
} from '../types';

export type {
  Product,
  ConsultationBudget,
  CreateConsultationInput,
  ConsultationRecord,
  RankedRecommendationItem,
  GenerateRecommendationsResponse,
  RecommendationResult,
};

/**
 * Runtime type guard for unknown object records
 */
function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

export interface ConsultationApiResponse {
  success: boolean;
  message?: string;
  data: any;
  count?: number;
}

/**
 * Formats a budget object into an INR display string (e.g. ₹1,500 – ₹3,500)
 */
export const formatBudget = (budget?: ConsultationBudget): string => {
  if (!budget) return '₹1,500 – ₹3,500';
  const minStr = typeof budget.min === 'number' ? budget.min.toLocaleString('en-IN') : '500';
  const maxStr = typeof budget.max === 'number' ? budget.max.toLocaleString('en-IN') : '3,500';
  return `₹${minStr} – ₹${maxStr}`;
};

/**
 * Normalizes a raw consultation document returned from MongoDB/Express
 */
export const normalizeConsultation = (raw: unknown): ConsultationRecord => {
  const item = isRecord(raw) ? raw : {};
  const id = typeof item.id === 'string' && item.id ? item.id : typeof item._id === 'string' ? item._id : '';
  const createdAt = typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString();
  let date = '';
  try {
    date = new Date(createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    date = 'Recent';
  }

  const rawBudget = isRecord(item.budget) ? item.budget : {};
  const budget: ConsultationBudget = {
    min: typeof rawBudget.min === 'number' ? rawBudget.min : 1500,
    max: typeof rawBudget.max === 'number' ? rawBudget.max : 3500,
    currency: typeof rawBudget.currency === 'string' ? rawBudget.currency : 'INR',
  };

  return {
    ...item,
    id,
    _id: (typeof item._id === 'string' ? item._id : id) as string,
    recipientName: typeof item.recipientName === 'string' ? item.recipientName : 'Recipient',
    relationship: typeof item.relationship === 'string' ? item.relationship : 'partner',
    occasion: typeof item.occasion === 'string' ? item.occasion : 'anniversary',
    interests: Array.isArray(item.interests) ? (item.interests as string[]) : [],
    personality: Array.isArray(item.personality) ? (item.personality as string[]) : [],
    desiredEmotion: typeof item.desiredEmotion === 'string' ? item.desiredEmotion : 'romance',
    budget,
    budgetFormatted: formatBudget(budget),
    date,
    productCategories: Array.isArray(item.productCategories) ? (item.productCategories as string[]) : [],
    exclusions: Array.isArray(item.exclusions) ? (item.exclusions as string[]) : [],
    notes: typeof item.notes === 'string' ? item.notes : '',
    status: (item.status === 'in_progress' || item.status === 'saved' ? item.status : 'completed'),
    createdAt,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : createdAt,
  };
};

export const consultationService = {
  /**
   * Persists a consultation profile via POST /api/v1/consultations
   * Automatically sets or reuses the HTTP-only guest session cookie or authenticated session.
   * Supports server-side idempotency via Idempotency-Key header / payload field.
   */
  async createConsultation(
    input: CreateConsultationInput,
    idempotencyKey?: string
  ): Promise<ConsultationRecord> {
    const key = idempotencyKey || input.idempotencyKey;
    const payload: CreateConsultationInput = {
      recipientName: input.recipientName?.trim() || 'Recipient',
      relationship: input.relationship,
      occasion: input.occasion,
      interests: Array.isArray(input.interests) ? input.interests : [],
      personality: Array.isArray(input.personality) ? input.personality : [],
      desiredEmotion: input.desiredEmotion,
      budget: input.budget || { min: 1500, max: 3500, currency: 'INR' },
      productCategories: Array.isArray(input.productCategories) ? input.productCategories : [],
      exclusions: Array.isArray(input.exclusions) ? input.exclusions : [],
      notes: input.notes?.trim() || '',
      status: input.status || 'completed',
      idempotencyKey: key,
    };

    const headers: Record<string, string> = {};
    if (key) {
      headers['Idempotency-Key'] = key;
    }

    const response = await api.post<ConsultationApiResponse>('/consultations', payload, {
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });
    if (!response.data || !response.data.data) {
      throw new Error('Malformed response received from consultation service.');
    }

    return normalizeConsultation(response.data.data);
  },

  /**
   * Retrieves consultations for the current user or guest session via GET /api/v1/consultations
   */
  async getConsultations(): Promise<ConsultationRecord[]> {
    const response = await api.get<ConsultationApiResponse>('/consultations');
    if (!response.data || !Array.isArray(response.data.data)) {
      return [];
    }

    return response.data.data.map(normalizeConsultation);
  },

  /**
   * Retrieves a single consultation by its 24-character hex ObjectId
   */
  async getConsultationById(id: string): Promise<ConsultationRecord | null> {
    if (!id) return null;

    try {
      const response = await api.get<ConsultationApiResponse>(`/consultations/${encodeURIComponent(id)}`);
      if (!response.data || !response.data.data) {
        return null;
      }
      return normalizeConsultation(response.data.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  },

  /**
   * Generates grounded recommendations using backend deterministic scoring engine
   * via POST /api/v1/consultations/generate/:consultationId
   * Strictly requires a valid 24-character hexadecimal ObjectId.
   * Enforces the authoritative backend response contract: data.items.
   * Throws explicit integration errors if the response or items are malformed.
   * Narrows all response fields safely from unknown using runtime type guards.
   */
  async generateRecommendations(
    consultationId: string
  ): Promise<RecommendationResult> {
    const cleanId = typeof consultationId === 'string' ? consultationId.trim() : '';
    if (!cleanId || !/^[0-9a-fA-F]{24}$/.test(cleanId)) {
      throw new Error(
        'A valid 24-character hexadecimal consultation ID is required to generate recommendations.'
      );
    }

    const response = await api.post<GenerateRecommendationsResponse>(
      `/consultations/generate/${encodeURIComponent(cleanId)}`,
      {}
    );

    const resData: unknown = response.data;
    if (!isRecord(resData) || resData.success !== true || !isRecord(resData.data)) {
      throw new Error('Malformed API response: Expected success status and data object from recommendation service.');
    }

    const resId = resData.data.consultationId;
    if (typeof resId !== 'string' || !resId.trim()) {
      throw new Error('Malformed API response: Missing valid consultationId in response data.');
    }

    const rawItems = resData.data.items;
    if (!Array.isArray(rawItems)) {
      throw new Error('Malformed API response: "items" must be an array in response data.');
    }

    // Validate that every recommendation contains a valid product, integer score (0–99), and string rationale.
    // Narrows raw unknown items safely with explicit runtime checks.
    const validatedItems: RankedRecommendationItem[] = rawItems.map((item: unknown, index: number) => {
      if (!isRecord(item)) {
        throw new Error(`Malformed recommendation item at index ${index}: Item must be a non-null object.`);
      }

      const product = item.product;
      const score = item.score;
      const rationale = item.rationale;

      if (!isRecord(product)) {
        throw new Error(`Malformed recommendation item at index ${index}: Missing or invalid product object.`);
      }

      const rawId = typeof product.id === 'string' && product.id.trim()
        ? product.id.trim()
        : typeof product._id === 'string' && product._id.trim()
        ? product._id.trim()
        : null;

      if (!rawId) {
        throw new Error(`Malformed recommendation item at index ${index}: Product must have a valid non-empty string identifier.`);
      }

      // Requirement: Score must be an integer, min 0, max 99. Reject 100, decimals, NaN, Infinity.
      if (
        typeof score !== 'number' ||
        !Number.isInteger(score) ||
        score < 0 ||
        score > 99
      ) {
        throw new Error(
          `Malformed recommendation item at index ${index}: Score must be an integer between 0 and 99 (received: ${score}).`
        );
      }

      if (typeof rationale !== 'string' || !rationale.trim()) {
        throw new Error(`Malformed recommendation item at index ${index}: Missing or empty string rationale.`);
      }

      const validatedProduct: Product = {
        ...(product as unknown as Product),
        id: rawId,
      };

      return {
        product: validatedProduct,
        score,
        rationale: rationale.trim(),
      };
    });

    const message = typeof resData.message === 'string' ? resData.message : undefined;

    return {
      consultationId: resId.trim(),
      items: validatedItems,
      message,
    };
  },
};

export default consultationService;
