import api from './api';
import type { User } from '../context/AuthContext';

export interface AuthResponse {
  success: boolean;
  message?: string;
  user: User;
  accessToken?: string;
}

export const authService = {
  /**
   * Fetches the currently authenticated user profile
   * GET /api/v1/auth/me
   */
  async getCurrentUser(): Promise<User> {
    const res = await api.get<{ success: boolean; user: User }>('/auth/me');
    return res.data.user;
  },

  /**
   * Logs in an existing user
   * POST /api/v1/auth/login
   */
  async login(email: string, password: string): Promise<User> {
    const res = await api.post<AuthResponse & { refreshToken?: string }>('/auth/login', { email, password });
    if (res.data.accessToken) {
      try {
        localStorage.setItem('charis_access_token', res.data.accessToken);
        if (res.data.refreshToken) {
          localStorage.setItem('charis_refresh_token', res.data.refreshToken);
        }
      } catch {
        // ignore
      }
    }
    return res.data.user;
  },

  /**
   * Registers a new user account
   * POST /api/v1/auth/register
   */
  async register(name: string, email: string, password: string): Promise<User> {
    const res = await api.post<AuthResponse & { refreshToken?: string }>('/auth/register', { name, email, password });
    if (res.data.accessToken) {
      try {
        localStorage.setItem('charis_access_token', res.data.accessToken);
        if (res.data.refreshToken) {
          localStorage.setItem('charis_refresh_token', res.data.refreshToken);
        }
      } catch {
        // ignore
      }
    }
    return res.data.user;
  },

  /**
   * Refreshes the session tokens
   * POST /api/v1/auth/refresh
   */
  async refreshSession(): Promise<void> {
    let refreshToken: string | null = null;
    try {
      refreshToken = localStorage.getItem('charis_refresh_token');
    } catch {
      // ignore
    }
    const res = await api.post<{ accessToken?: string; refreshToken?: string }>('/auth/refresh', { refreshToken });
    if (res.data.accessToken) {
      try {
        localStorage.setItem('charis_access_token', res.data.accessToken);
        if (res.data.refreshToken) {
          localStorage.setItem('charis_refresh_token', res.data.refreshToken);
        }
      } catch {
        // ignore
      }
    }
  },

  /**
   * Terminates the current session and clears cookies
   * POST /api/v1/auth/logout
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      try {
        localStorage.removeItem('charis_access_token');
        localStorage.removeItem('charis_refresh_token');
      } catch {
        // ignore
      }
    }
  },
};

export default authService;
