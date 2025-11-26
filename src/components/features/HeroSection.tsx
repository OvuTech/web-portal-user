'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SearchForm } from './SearchForm';
import { Header } from '@/components/layouts/Header';

const nigerianStates = [
  'Abia',
  'Abuja',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % nigerianStates.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-hero-bg pb-12 pt-14">
      {/* Header with proper spacing */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <Header />
      </div>

      {/* Hero Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col items-center justify-center space-y-8 pt-8">
          {/* Nigeria Flag and Location */}
          <div className="mb-6 flex items-center justify-center gap-3 md:mb-8">
            <Image
              src="/twemoji_flag-nigeria.png"
              alt="Nigeria Flag"
              width={50}
              height={50}
              className="h-10 w-10 md:h-[50px] md:w-[50px]"
            />
            <div className="relative flex h-[30px] min-w-[100px] items-center justify-center overflow-hidden md:min-w-[150px]">
              <span
                className={`text-[22px] text-[#464646] transition-all duration-300 md:text-[28px] ${
                  isAnimating ? '-translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
                }`}
              >
                {nigerianStates[currentIndex]}
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="mb-4 max-w-[940px] text-center font-heading text-[32px] font-bold text-[#303030] md:text-[52px] lg:text-[70px]">
            One Stop for Flights and Road Trips in Nigeria
          </h1>

          {/* Subtitle */}
          <p className="mb-10 max-w-[700px] px-4 text-center text-[14px] text-[#464646] md:px-6 md:text-[16px] lg:text-[18px]">
            Search, book, and pay for buses and flights, all in one place.
          </p>

          {/* Search Form */}
          <SearchForm />
        </div>
      </div>
    </section>
  );
}
