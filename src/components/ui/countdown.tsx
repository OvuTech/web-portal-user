'use client';

import { useState, useEffect } from 'react';

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

  useEffect(() => {
    // Start countdown timer from search start time
    const searchStartTime = sessionStorage.getItem('searchStartTime');
    if (searchStartTime) {
      const elapsed = Math.floor((Date.now() - parseInt(searchStartTime)) / 1000);
      const remaining = Math.max(1800 - elapsed, 0);
      setTimeLeft(remaining);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black py-4 text-center">
      <p className="text-sm text-white md:text-base">
        Please secure your booking within <span className="font-bold">{formatTime(timeLeft)}</span>
      </p>
    </div>
  );
}
