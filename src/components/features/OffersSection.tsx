'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function OffersSection() {
  const [activeTab, setActiveTab] = useState<'flight' | 'road'>('flight');

  return (
    <section className="w-full">
      {/* Carousel Section with gray background */}
      <div className="w-full bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          {/* Carousel */}
          <div className="relative mb-12">
            {/* Previous Button */}
            <button
              className="absolute left-0 top-1/2 z-10 -translate-x-4 -translate-y-1/2 cursor-pointer rounded-full bg-white p-2 shadow-lg hover:bg-gray-50"
              aria-label="Previous"
            >
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Carousel Items */}
            <div className="flex space-x-4 overflow-hidden">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="relative flex-shrink-0 overflow-hidden rounded-[10px]"
                  style={{ width: 'calc(33.333% - 1rem)' }}
                >
                  {/* Travel Promo Image */}
                  <Image
                    src="/travel-promo.png"
                    alt="Travel Promotion Offer"
                    width={520}
                    height={246}
                    className="h-auto w-full rounded-[10px] object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-4 cursor-pointer rounded-full bg-ovu-primary p-2 shadow-lg hover:bg-ovu-secondary"
              aria-label="Next"
            >
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Offers Section with hero background */}
      <div className="w-full bg-hero-bg py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Offers</h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi molestie a tortor quis
              tempor. Suspendisse mollis arcu et non tortor elementum auctor. Maecenas eu turpis nec
              ex porta vehicula.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex space-x-1 bg-white rounded-[12px] px-2 py-2 w-fit ">
            <button
              onClick={() => setActiveTab('flight')}
              className={cn(
                'cursor-pointer rounded-[10px] px-8 text-center py-4 w-fit text-sm font-medium transition-colors',
                activeTab === 'flight'
                  ? 'bg-ovu-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              )}
            >
              Flight
            </button>
            <button
              onClick={() => setActiveTab('road')}
              className={cn(
                'cursor-pointer rounded-[10px] px-8 text-center py-4 w-fit text-sm font-medium transition-colors',
                activeTab === 'road'
                  ? 'bg-ovu-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              )}
            >
              Road
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="flex h-[268px] w-full max-w-[464px] items-center justify-center rounded-[10px] bg-white p-6 shadow-md"
              >
                <p className="text-lg font-medium text-gray-500">Card {item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
