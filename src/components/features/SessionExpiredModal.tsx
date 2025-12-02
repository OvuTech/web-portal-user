'use client';

import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SessionExpiredModal({ isOpen, onClose }: SessionExpiredModalProps) {
  const router = useRouter();

  const handleStartNewSearch = () => {
    onClose();
    // Clear any stale session data
    sessionStorage.removeItem('currentBooking');
    sessionStorage.removeItem('selectedRoute');
    sessionStorage.removeItem('selectedSeats');
    sessionStorage.removeItem('bookingPassengers');
    // Redirect to home for new search
    router.push('/');
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-xl">
          {/* Timer Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              {/* Main clock circle */}
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer orange ring */}
                <circle cx="60" cy="60" r="45" stroke="#F7931E" strokeWidth="8" fill="none" />
                {/* Inner blue ring */}
                <circle cx="60" cy="60" r="35" stroke="#1B4B66" strokeWidth="4" fill="white" />
                {/* Clock face - pie chart style */}
                <path d="M60 25 A35 35 0 0 1 95 60 L60 60 Z" fill="#8DC63F" />
                <path d="M60 25 A35 35 0 0 0 25 60 A35 35 0 0 0 60 95 A35 35 0 0 0 95 60 L60 60 L60 25" fill="#E8F4FD" />
                {/* Clock hand/indicator */}
                <line x1="60" y1="60" x2="60" y2="30" stroke="#1B4B66" strokeWidth="3" strokeLinecap="round" />
                {/* Top loop */}
                <circle cx="60" cy="12" r="6" stroke="#E74C3C" strokeWidth="3" fill="none" />
              </svg>
              {/* Alert badge */}
              <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#E74C3C]">
                <span className="text-xl font-bold text-white">!</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <Dialog.Title className="mb-3 text-center text-2xl font-semibold text-gray-900">
            Session Expired
          </Dialog.Title>

          {/* Description */}
          <Dialog.Description className="mb-8 text-center text-gray-500">
            Your session has expired, kindly try another search
          </Dialog.Description>

          {/* Button */}
          <button
            onClick={handleStartNewSearch}
            className="w-full cursor-pointer rounded-xl bg-ovu-primary py-4 text-lg font-semibold text-white transition-colors hover:bg-ovu-secondary"
          >
            Start a new search
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

