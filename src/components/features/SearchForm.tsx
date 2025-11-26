'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

type TripType = 'flight' | 'road';
type FlightType = 'one-way' | 'round-trip';

export function SearchForm() {
  const router = useRouter();
  const [tripType, setTripType] = useState<TripType>('flight');
  const [flightType, setFlightType] = useState<FlightType>('one-way');

  const handleSearch = () => {
    router.push('/search-flights');
  };

  // Calculate number of columns based on trip type and flight type
  const getGridColumns = () => {
    if (tripType === 'road' && flightType === 'one-way') {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'; // From, To, Departure, Travellers = 4 fields
    }
    if (tripType === 'road' && flightType === 'round-trip') {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'; // From, To, Departure, Arrival, Travellers = 5 fields
    }
    if (flightType === 'one-way') {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'; // From, To, Departure, Class, Travellers = 5 fields
    }
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6'; // From, To, Departure, Arrival, Class, Travellers = 6 fields
  };

  return (
    <div className="relative w-full">
      {/* Tab Navigation - Centered and overlapping */}
      <div className="relative z-10 -mb-4 flex justify-center">
        <div className="flex rounded-[12px] bg-white shadow-md">
          <button
            onClick={() => setTripType('flight')}
            className={cn(
              'relative px-6 py-3 text-sm font-medium transition-colors md:px-8 md:text-base',
              tripType === 'flight'
                ? 'text-gray-900 after:absolute after:left-1/2 after:top-0 after:h-1 after:w-12 after:-translate-x-1/2 after:bg-yellow-400'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Flight
          </button>
          <button
            onClick={() => setTripType('road')}
            className={cn(
              'relative px-6 py-3 text-sm font-medium transition-colors md:px-8 md:text-base',
              tripType === 'road'
                ? 'text-gray-900 after:absolute after:left-1/2 after:top-0 after:h-1 after:w-12 after:-translate-x-1/2 after:bg-yellow-400'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Road
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="w-full rounded-lg bg-white p-4 pt-8 shadow-lg md:p-6 md:pt-10">
        {/* Flight/Road Type Radio Buttons */}
        <div className="mb-6">
          <RadioGroup
            value={flightType}
            onValueChange={(value) => setFlightType(value as FlightType)}
            className="flex items-center space-x-4 md:space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="one-way" id="one-way" className="border-gray-300 text-[#065888]" />
              <Label htmlFor="one-way" className="cursor-pointer text-xs font-medium text-gray-700 md:text-sm">
                One Way
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="round-trip" id="round-trip" className="border-gray-300 text-[#065888]" />
              <Label htmlFor="round-trip" className="cursor-pointer text-xs font-medium text-gray-700 md:text-sm">
                Round Trip
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Form Fields */}
        <div className={cn('grid gap-3', getGridColumns())}>
          {/* From */}
          <div className="flex flex-col">
            <Label className="mb-1.5 text-xs font-medium text-[#111111] md:text-sm">From</Label>
            <div className="relative">
              <Select defaultValue="lagos">
                <SelectTrigger className="!h-[60px] w-full rounded-[10px] border border-[#ECECEC] bg-white px-3 pb-4 pt-2 text-xs font-medium text-ovu-primary shadow-none focus:border-ovu-primary focus:outline-none focus:ring-1 focus:ring-ovu-primary md:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lagos">Lagos</SelectItem>
                  <SelectItem value="abuja">Abuja</SelectItem>
                  <SelectItem value="portharcourt">Port Harcourt</SelectItem>
                </SelectContent>
              </Select>
              <span className="pointer-events-none absolute bottom-2 left-3 text-[10px] text-gray-400">
                {tripType === 'road' ? 'Ajah' : 'Lagos, Murtala Muhammed Internati...'}
              </span>
            </div>
          </div>

          {/* To */}
          <div className="flex flex-col">
            <Label className="mb-1.5 text-xs font-medium text-[#111111] md:text-sm">To</Label>
            <div className="relative">
              <Select defaultValue="abuja">
                <SelectTrigger className="!h-[60px] w-full rounded-[10px] border border-[#ECECEC] bg-white px-3 pb-4 pt-2 text-xs font-medium text-ovu-primary shadow-none focus:border-ovu-primary focus:outline-none focus:ring-1 focus:ring-ovu-primary md:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abuja">{tripType === 'road' ? 'Benin' : 'Abuja'}</SelectItem>
                  <SelectItem value="lagos">Lagos</SelectItem>
                  <SelectItem value="kano">Kano</SelectItem>
                </SelectContent>
              </Select>
              <span className="pointer-events-none absolute bottom-2 left-3 text-[10px] text-gray-400">
                {tripType === 'road' ? 'Uselu' : 'Lagos, Murtala Muhammed Internati...'}
              </span>
            </div>
          </div>

          {/* Departure */}
          <div className="flex flex-col">
            <Label className="mb-1.5 text-xs font-medium text-[#111111] md:text-sm">Departure</Label>
            <div className="relative">
              <Input
                type="date"
                defaultValue="2025-03-20"
                className="!h-[60px] w-full rounded-[10px] border border-[#ECECEC] bg-white px-3 pb-4 pt-2 text-xs font-medium text-ovu-primary shadow-none focus:border-ovu-primary focus:outline-none focus:ring-1 focus:ring-ovu-primary md:text-sm"
              />
              <span className="pointer-events-none absolute bottom-2 left-3 text-[10px] text-gray-400">Sunday 2025</span>
            </div>
          </div>

          {/* Arrival - Only for Round Trip (both Flight and Road) */}
          {flightType === 'round-trip' && (
            <div className="flex flex-col">
              <Label className="mb-1.5 text-xs font-medium text-[#111111] md:text-sm">Arrival</Label>
              <div className="relative">
                <Input
                  type="date"
                  defaultValue="2025-03-22"
                  className="!h-[60px] w-full rounded-[10px] border border-[#ECECEC] bg-white px-3 pb-4 pt-2 text-xs font-medium text-ovu-primary shadow-none focus:border-ovu-primary focus:outline-none focus:ring-1 focus:ring-ovu-primary md:text-sm"
                />
                <span className="pointer-events-none absolute bottom-2 left-3 text-[10px] text-gray-400">Tues 2025</span>
              </div>
            </div>
          )}

          {/* Class - Only for Flight */}
          {tripType === 'flight' && (
            <div className="flex flex-col">
              <Label className="mb-1.5 text-xs font-medium text-[#111111] md:text-sm">Class</Label>
              <div className="relative">
                <Select defaultValue="economy">
                  <SelectTrigger className="!h-[60px] w-full rounded-[10px] border border-[#ECECEC] bg-white px-3 pb-4 pt-2 text-xs font-medium text-ovu-primary shadow-none focus:border-ovu-primary focus:outline-none focus:ring-1 focus:ring-ovu-primary md:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="firstclass">First Class</SelectItem>
                  </SelectContent>
                </Select>
                <span className="pointer-events-none absolute bottom-2 left-3 text-[10px] text-gray-400">conomy</span>
              </div>
            </div>
          )}

          {/* Travelers - Always show */}
          <div className="flex flex-col">
            <Label className="mb-1.5 text-xs font-medium text-[#111111] md:text-sm">Traveller(s)</Label>
            <div className="relative">
              <Select defaultValue="2">
                <SelectTrigger className="!h-[60px] w-full rounded-[10px] border border-[#ECECEC] bg-white px-3 pb-4 pt-2 text-xs font-medium text-ovu-primary shadow-none focus:border-ovu-primary focus:outline-none focus:ring-1 focus:ring-ovu-primary md:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Traveller</SelectItem>
                  <SelectItem value="2">2 Travellers</SelectItem>
                  <SelectItem value="3">3 Travellers</SelectItem>
                  <SelectItem value="4">4 Travellers</SelectItem>
                </SelectContent>
              </Select>
              <span className="pointer-events-none absolute bottom-2 left-3 text-[10px] text-gray-400">2 Adult</span>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSearch}
            className="w-full rounded-md bg-ovu-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-ovu-secondary focus:outline-none focus:ring-2 focus:ring-ovu-primary focus:ring-offset-2 sm:w-auto"
          >
            {tripType === 'flight' ? 'Search Flights' : 'Search'}
          </button>
        </div>
      </div>
    </div>
  );
}
