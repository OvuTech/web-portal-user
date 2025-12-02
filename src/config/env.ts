/**
 * Environment configuration
 * Centralized environment variables with type safety
 */

// In production on Vercel, use API routes as proxy to avoid CORS issues
// In development, call API directly
const getApiUrl = () => {
  // If running on Vercel or other production environment
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    return '/api'; // Use Next.js API routes as proxy
  }
  // In development, call API directly
  return process.env.NEXT_PUBLIC_API_URL || '';
};

export const env = {
  apiUrl: getApiUrl(),
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;
