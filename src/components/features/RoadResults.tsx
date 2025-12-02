'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SearchResponse, Route } from '@/lib/api/types';

interface RoadTrip {
  company: string;
  vehicleImage: string;
  time: string;
  travelers: string;
  seatsAvailable: string;
  vehicleType: string;
  vehicleNumber: string;
  price: string;
}

// Format API Route to RoadTrip
function formatRoadTrip(route: Route): RoadTrip {
  return {
    company: route.provider,
    vehicleImage: route.provider_logo || '/gig.png',
    time: new Date(route.departure.time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
    travelers: '1 Traveller', // This can be derived from search params
    seatsAvailable: `${route.available_seats || 10} Seats (available)`,
    vehicleType: route.vehicle_number ? `Vehicle ${route.vehicle_number}` : 'Jet (Jet Mover X)',
    vehicleNumber: `Vehicle No: ${route.vehicle_number || '278'}`,
    price: `${route.price.currency === 'NGN' ? '₦' : route.price.currency}${route.price.amount.toLocaleString()}`,
  };
}

// Fallback mock data
const mockRoadTrips = Array(10).fill({
  company: 'GIG Motors',
  vehicleImage: '/gig.png',
  time: '08 : 00 AM',
  travelers: '1 Traveller',
  seatsAvailable: '10 Seats (available)',
  vehicleType: 'Jet (Jet Mover X)',
  vehicleNumber: 'Vehicle No: 278',
  price: '₦30,000',
});

export function RoadResults() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [roadTrips, setRoadTrips] = useState<RoadTrip[]>(mockRoadTrips);
  const [totalCount, setTotalCount] = useState(10);

  useEffect(() => {
    // Get search results from sessionStorage
    const searchResultsStr = sessionStorage.getItem('searchResults');

    if (searchResultsStr) {
      try {
        const searchResults: SearchResponse = JSON.parse(searchResultsStr);

        // Store original routes
        setRoutes(searchResults.results);

        // Format routes for display
        const formattedResults = searchResults.results.map((route) => formatRoadTrip(route));

        setRoadTrips(formattedResults);
        setTotalCount(searchResults.total_results);
      } catch (error) {
        console.error('Error parsing search results:', error);
        // Keep using mock data
      }
    }
  }, []);

  const handleViewSeats = (index: number) => {
    // Store the selected route's data in sessionStorage
    if (routes.length > 0 && routes[index]) {
      const selectedRoute = routes[index];
      sessionStorage.setItem('selectedRoute', JSON.stringify(selectedRoute));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-12">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 md:text-xl">Search Results</h2>
          <p className="text-sm text-gray-600">{totalCount} options found</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
              />
            </svg>
            Filters
          </button>
          <button className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h18M3 8h18m-7 4h7"
              />
            </svg>
            Cheapest
          </button>
        </div>
      </div>

      {/* Road Trip Cards */}
      <div className="space-y-4">
        {roadTrips.map((trip, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            {/* Left Section - Vehicle Image and Company Info */}
            <div className="flex items-center gap-4">
              {/* Vehicle Image */}
              <div className="relative h-[141px] w-[274px] flex-shrink-0 overflow-hidden rounded-[5px]">
                {/* Vehicle Image */}
                <Image
                  src={trip.vehicleImage}
                  alt={trip.company}
                  width={274}
                  height={141}
                  className="h-full w-full rounded-[5px]"
                />

                {/* GIG Logistics Logo Badge */}
                <div className="absolute left-[7px] top-[5px] z-10 h-[37px] w-[39px] rounded-[5px] border border-gray-200 bg-white">
                  <Image
                    src="/giglogistics.png"
                    alt="GIG Logistics"
                    width={39}
                    height={37}
                    className="h-full w-full rounded-[5px] object-contain p-1"
                  />
                </div>
              </div>

              {/* Company Details */}
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-gray-900">{trip.company}</h3>

                {/* Time */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{trip.time}</span>
                </div>

                {/* Travelers */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>{trip.travelers}</span>
                </div>

                {/* Seats Available */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{trip.seatsAvailable}</span>
                </div>
              </div>
            </div>

            {/* Right Section - Vehicle Info and Price */}
            <div className="flex flex-col items-end gap-4 md:min-w-[250px]">
              {/* Vehicle Info */}
              <div className="text-right">
                <p className="text-sm text-gray-600">{trip.vehicleType}</p>
                <p className="text-sm text-gray-600">{trip.vehicleNumber}</p>
              </div>

              {/* Price and Button */}
              <div className="flex flex-col items-end gap-3">
                <p className="text-2xl font-bold text-red-600">{trip.price}</p>
                <Link href="/book-road" onClick={() => handleViewSeats(index)}>
                  <button className="cursor-pointer rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
                    View Seats
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
