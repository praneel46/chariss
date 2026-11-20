/**
 * Frontend Environment & API Configuration
 * Centralized access for Vite environment variables
 */

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api/v1';

export const config = {
  apiUrl: API_BASE_URL,
} as const;

export default config;
