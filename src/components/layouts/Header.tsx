'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthModal } from '@/components/features/AuthModal';

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <header className="w-full rounded-[10px] bg-white px-4 py-3 sm:px-6 sm:py-4 lg:px-12 lg:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="OVU Logo"
              width={80}
              height={32}
              className="h-6 w-auto sm:h-7 md:h-8"
            />
          </Link>

          {/* Login/Create Account Button */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="rounded-[10px] bg-ovu-primary px-3 py-2 text-sm font-normal text-white transition-colors hover:bg-ovu-secondary focus:outline-none focus:ring-2 focus:ring-ovu-primary focus:ring-offset-2 sm:px-4 sm:py-2.5 sm:text-base md:px-6"
          >
            <span className="hidden sm:inline">Login/Create Account</span>
            <span className="sm:hidden">Login</span>
          </button>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
