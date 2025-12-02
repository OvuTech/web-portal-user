'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, type User } from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          console.log('[AuthContext] Checking auth on mount, token exists');
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          console.log('[AuthContext] User verified:', currentUser.email);
        } else {
          console.log('[AuthContext] No token found on mount');
        }
      } catch (error: any) {
        console.error('[AuthContext] Failed to get current user:', error);

        // Only clear tokens if we get a 401 Unauthorized error
        // Don't clear on network errors or other issues
        if (error.response?.status === 401) {
          console.warn('[AuthContext] Token invalid (401), clearing tokens');
          authService.clearTokens();
          setUser(null);
        } else {
          console.warn('[AuthContext] Auth check failed but keeping tokens (may be network issue)');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('[AuthContext] Login attempt for:', email);
      const response = await authService.login({ email, password });

      console.log('[AuthContext] Login response received');
      console.log('[AuthContext] Has access_token:', !!response.access_token);
      console.log('[AuthContext] Has refresh_token:', !!response.refresh_token);

      authService.setTokens(response.access_token, response.refresh_token);
      console.log('[AuthContext] Tokens saved to localStorage');

      // Fetch user data after successful login
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      console.log('[AuthContext] User data fetched:', currentUser.email);
    } catch (error) {
      console.error('[AuthContext] Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      // Split full name into first and last name
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0]; // If no last name, use first name

      // Registration only returns user object, not tokens
      await authService.register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });

      // Registration successful - user needs to login
      // Don't set tokens or user here, let the UI handle success message
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.clearTokens();
    setUser(null);
    // Stay on current page - user can click login in header to re-authenticate
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
