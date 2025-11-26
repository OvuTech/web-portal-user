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
        // Handle common error responses
        if (error.response?.status === 401) {
          // Handle unauthorized access
          this.handleUnauthorized();
        }

        if (error.response?.status === 403) {
          // Handle forbidden access
          console.error('Access forbidden');
        }

        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    // Implement your token retrieval logic here
    // For example, from localStorage, cookies, or your state management
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private handleUnauthorized() {
    // Implement your unauthorized handling logic
    // For example, redirect to login page or refresh token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      // Redirect to login or dispatch logout action
    }
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
