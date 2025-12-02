'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SessionExpiredModal } from '@/components/features/SessionExpiredModal';

interface SessionContextType {
  showSessionExpired: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const showSessionExpired = () => {
    setIsSessionExpired(true);
  };

  const handleClose = () => {
    setIsSessionExpired(false);
  };

  return (
    <SessionContext.Provider value={{ showSessionExpired }}>
      {children}
      <SessionExpiredModal isOpen={isSessionExpired} onClose={handleClose} />
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

