'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/api/auth';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code and state from URL params
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setError('Google sign-in was cancelled or failed');
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        if (!code) {
          setError('No authorization code received');
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        // Exchange code for tokens by calling the backend
        const data = await authService.googleCallback(code, state || undefined);

        // Store tokens
        authService.setTokens(data.access_token, data.refresh_token);

        // Redirect to home page
        router.push('/');
      } catch (err) {
        console.error('Google OAuth callback error:', err);
        setError('Failed to complete Google sign-in');
        setTimeout(() => router.push('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        {error ? (
          <>
            <div className="mb-4 text-red-600">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Authentication Error</h2>
            <p className="text-gray-600">{error}</p>
            <p className="mt-4 text-sm text-gray-500">Redirecting to home page...</p>
          </>
        ) : (
          <>
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 animate-spin text-ovu-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Completing Google Sign-In</h2>
            <p className="text-gray-600">Please wait while we complete your authentication...</p>
          </>
        )}
      </div>
    </div>
  );
}
