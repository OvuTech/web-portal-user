'use client';

import Image from 'next/image';
import { Plane } from 'lucide-react';

const flights = Array(10).fill({
  airline: 'Air Peace',
  flightNumber: 'P47130',
  duration: '1hr 20min',
  departure: {
    date: '19:00 | 28 Sep 25',
    airport: 'Lagos, Murtala Muhammed International Airport',
  },
  arrival: {
    date: '19:00 | 28 Sep 25',
    airport: 'Lagos, Murtala Muhammed International Airport',
  },
  travelTime: '1hrs 20mins',
  stops: 'Non Stop',
  price: '₦200,000',
  seatsLeft: 4,
  badges: {
    cheapest: false,
    fastest: false,
  },
});

export function FlightResults() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-12">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 md:text-xl">Search Results</h2>
          <p className="text-sm text-gray-600">10 Flights found</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
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
          <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
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

      {/* Flight Cards */}
      <div className="space-y-4">
        {flights.map((flight, index) => (
          <div
            key={index}
            className={`relative flex flex-col gap-4 rounded-lg bg-white shadow-sm md:flex-row md:items-center md:gap-6 ${
              index === 0 ? 'pb-6 pl-6 pr-6 pt-14' : 'p-6'
            }`}
          >
            {/* Badges - Top Left */}
            {index === 0 && (
              <div className="absolute left-[15px] top-[16px] flex gap-2">
                <span className="flex h-[25px] w-[81px] items-center justify-center rounded-[10px] bg-[#A8FFAC] p-[5px] text-xs font-medium text-gray-900">
                  Cheapest
                </span>
                <span className="flex h-[25px] w-[81px] items-center justify-center rounded-[10px] bg-[#A9E4FF] p-[5px] text-xs font-medium text-gray-900">
                  Fastest
                </span>
              </div>
            )}

            {/* Left Section - Airline Info */}
            <div className="flex items-center gap-3 md:w-[200px]">
              {/* Airline Logo */}
              <div className="flex h-[72px] w-[78px] flex-shrink-0 items-center justify-center rounded-[5px] border border-gray-200 bg-white">
                <Image
                  src="/airpeace.png"
                  alt="Air Peace"
                  width={78}
                  height={72}
                  className="h-full w-full object-contain p-2"
                />
              </div>

              {/* Airline Details */}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900">{flight.airline}</p>
                <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{flight.duration}</span>
                </div>
              </div>
            </div>

            {/* Middle Section - Flight Route */}
            <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:gap-6">
              {/* Departure */}
              <div className="w-full md:min-w-0 md:flex-1">
                <div className="flex h-auto min-h-[90px] w-full items-start gap-2 rounded-[5px] bg-[#EBF4FF] p-3 md:h-[114px] md:w-[220px]">
                  <Plane className="mt-1 h-4 w-4 flex-shrink-0 text-gray-600" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600">Departure</p>
                    <p className="font-semibold text-gray-900">{flight.departure.date}</p>
                    <p className="truncate text-xs text-gray-700">{flight.departure.airport}</p>
                  </div>
                </div>
              </div>

              {/* Travel Time */}
              <div className="flex flex-shrink-0 flex-col items-center md:flex-col">
                <p className="mb-2 text-xs text-gray-500">{flight.travelTime}</p>
                <div className="relative h-[1px] w-16 md:w-[236px]">
                  <div
                    className="absolute left-0 top-0 h-full w-full border-t border-dashed border-gray-400"
                    style={{ borderWidth: '1px' }}
                  ></div>
                  <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gray-400"></div>
                  <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gray-400"></div>
                </div>
                <p className="mt-2 text-xs font-medium text-gray-700">{flight.stops}</p>
              </div>

              {/* Arrival */}
              <div className="w-full md:min-w-0 md:flex-1">
                <div className="flex h-auto min-h-[90px] w-full items-start gap-2 rounded-[5px] bg-[#EBF4FF] p-3 md:h-[114px] md:w-[220px]">
                  <Plane className="mt-1 h-4 w-4 flex-shrink-0 rotate-90 text-gray-600" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600">Arrival</p>
                    <p className="font-semibold text-gray-900">{flight.arrival.date}</p>
                    <p className="truncate text-xs text-gray-700">{flight.arrival.airport}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Price & Book */}
            <div className="flex flex-shrink-0 items-center justify-between gap-4 border-t pt-4 md:w-[180px] md:flex-col md:items-center md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <div className="text-center">
                <p className="text-xs text-red-500">{flight.seatsLeft} seats left</p>
                <p className="text-2xl font-bold text-gray-900">{flight.price}</p>
              </div>
              <button className="whitespace-nowrap rounded-lg bg-ovu-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ovu-secondary focus:outline-none focus:ring-2 focus:ring-ovu-primary focus:ring-offset-2">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
