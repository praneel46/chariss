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
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    return res.data.user;
  },

  /**
   * Registers a new user account
   * POST /api/v1/auth/register
   */
  async register(name: string, email: string, password: string): Promise<User> {
    const res = await api.post<AuthResponse>('/auth/register', { name, email, password });
    return res.data.user;
  },

  /**
   * Refreshes the session tokens
   * POST /api/v1/auth/refresh
   */
  async refreshSession(): Promise<void> {
    await api.post('/auth/refresh');
  },

  /**
   * Terminates the current session and clears cookies
   * POST /api/v1/auth/logout
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};

export default authService;
