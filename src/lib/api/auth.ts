/**
 * Authentication API Service
 * Handles user registration, login, and token management
 */

import { apiClient } from './client';

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in?: number;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
}

export const authService = {
  /**
   * Register a new user
   * Returns user object only, not tokens - user must login after registration
   */
  async register(data: RegisterRequest): Promise<User> {
    return apiClient.post<User>('/auth/register', data);
  },

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  /**
   * Store authentication tokens in localStorage
   */
  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  },

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  },

  /**
   * Clear authentication tokens
   */
  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  /**
   * Exchange Google OAuth code for tokens
   */
  async googleCallback(code: string, state?: string): Promise<AuthResponse> {
    const params = new URLSearchParams({ code });
    if (state) params.append('state', state);
    return apiClient.get<AuthResponse>(`/auth/google/callback?${params.toString()}`);
  },
};
