import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config/api';

/**
 * Centralized Axios API Client
 * - Configured with API base URL and withCredentials for HTTP-only cookies
 * - Handles automatic refresh token rotation on 401 with concurrency queuing
 * - Prevents infinite retry loops
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Request interceptor: attach Bearer access token for cross-domain support (Safari/Chrome ITP)
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('charis_access_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore
  }
  return config;
});

// Response interceptor for automatic access-token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // Reject non-401 errors or requests without configuration immediately
    if (!originalRequest || !error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || '';

    // Do NOT attempt refresh on auth endpoints (avoids infinite loops)
    if (
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/logout')
    ) {
      return Promise.reject(error);
    }

    // Prevent repeated retries of the same failed request
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // If another request is currently refreshing the session, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      let refreshToken: string | null = null;
      try {
        refreshToken = localStorage.getItem('charis_refresh_token');
      } catch {
        // ignore
      }

      // POST /api/v1/auth/refresh rotates the session (sent via cookie AND via body fallback)
      const refreshRes = await api.post<{
        accessToken?: string;
        refreshToken?: string;
      }>('/auth/refresh', { refreshToken });

      if (refreshRes.data?.accessToken) {
        try {
          localStorage.setItem('charis_access_token', refreshRes.data.accessToken);
          if (refreshRes.data.refreshToken) {
            localStorage.setItem('charis_refresh_token', refreshRes.data.refreshToken);
          }
        } catch {
          // ignore
        }
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${refreshRes.data.accessToken}`;
        }
      }

      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      // If refresh fails, clear stored tokens so clean login can reoccur
      try {
        localStorage.removeItem('charis_access_token');
        localStorage.removeItem('charis_refresh_token');
      } catch {
        // ignore
      }
      processQueue(refreshError as AxiosError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
