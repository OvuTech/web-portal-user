import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

/**
 * API Client Configuration
 * Centralized Axios instance with interceptors for enterprise-level API management
 */

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add authentication token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('[API Client] Token added to request:', config.url);
        } else {
          console.warn('[API Client] No token available for request:', config.url);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const url = error.config?.url || '';
        
        // Handle common error responses
        if (error.response?.status === 401) {
          console.warn('[API Client] 401 Unauthorized for:', url);
          
          // Only clear tokens for non-auth endpoints
          // Auth endpoints (login, register) returning 401 means wrong credentials, not token issue
          // /auth/me returning 401 means token is invalid - let AuthContext handle this
          if (!url.includes('/auth/')) {
            console.warn('[API Client] Token may be expired for protected endpoint');
            // Don't clear tokens here - let the AuthContext handle it
            // This prevents race conditions and allows for proper error handling
          }
        }

        if (error.response?.status === 403) {
          // Handle forbidden access
          console.error('[API Client] Access forbidden:', url);
        }

        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    // Get access token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        console.log('[API Client] Token found in localStorage');
      }
      return token;
    }
    return null;
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
