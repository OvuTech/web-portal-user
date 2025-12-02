'use client';

import { type ReactNode } from 'react';
import { QueryProvider } from './query-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <SessionProvider>
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            toastOptions={{
              style: {
                fontFamily: 'var(--font-manrope)',
              },
            }}
          />
        </SessionProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
