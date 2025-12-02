'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { bookingService } from '@/lib/api/bookings';
import type { SearchRequest, TransportType } from '@/lib/api/types';

type TripType = 'flight' | 'road';
type FlightType = 'one-way' | 'round-trip';

export function SearchForm() {
  const router = useRouter();
  const [tripType, setTripType] = useState<TripType>('flight');
  const [flightType, setFlightType] = useState<FlightType>('one-way');
  const [isSearching, setIsSearching] = useState(false);

  // Form state
  const [origin, setOrigin] = useState('lagos');
  const [destination, setDestination] = useState('abuja');
  const [departureDateTime, setDepartureDateTime] = useState<Date>(new Date('2025-03-20T08:00:00'));
  const [returnDateTime, setReturnDateTime] = useState<Date>(new Date('2025-03-22T18:00:00'));
  const [travellers, setTravellers] = useState('2');

  const handleTripTypeChange = (type: TripType) => {
    // If user is on a search results page and switches transport type, go to homepage
    if (typeof window !== 'undefined' && (window.location.pathname.includes('search-') || window.location.pathname.includes('book-'))) {
      router.push('/');
    } else {
      setTripType(type);
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);

    try {
      // Map transport type
      const transportType: TransportType = tripType === 'flight' ? 'flight' : 'bus';

      // Format dates to ISO datetime string
      const departureDatetime = departureDateTime.toISOString().slice(0, 19);
      const returnDatetime = flightType === 'round-trip' ? returnDateTime.toISOString().slice(0, 19) : undefined;

      // Build search request
      const searchRequest: SearchRequest = {
        origin: origin,
        destination: destination,
        departure_date: departureDatetime,
        passengers: parseInt(travellers),
        transport_types: [transportType],
      };

      // Add return date for round trips
      if (returnDatetime) {
        searchRequest.return_date = returnDatetime;
      }

      // Add seat type for flights
      if (tripType === 'flight') {
        searchRequest.seat_type = 'economy'; // Could make this dynamic based on user selection
      }

      // Call API
      const response = await bookingService.search(searchRequest);

      // Store results in sessionStorage to pass to results page
      sessionStorage.setItem('searchResults', JSON.stringify(response));
      sessionStorage.setItem('searchParams', JSON.stringify(searchRequest));

      // Store search start time for timer
      sessionStorage.setItem('searchStartTime', Date.now().toString());

      // Navigate to results page
      if (tripType === 'flight') {
        router.push('/search-flights');
      } else {
        router.push('/search-road');
      }
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
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
            onClick={() => handleTripTypeChange('flight')}
            className={cn(
              'relative cursor-pointer px-6 py-3 text-sm font-medium transition-colors md:px-8 md:text-base',
              tripType === 'flight'
                ? 'text-gray-900 after:absolute after:left-1/2 after:top-0 after:h-1 after:w-12 after:-translate-x-1/2 after:bg-yellow-400'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Flight
          </button>
          <button
            onClick={() => handleTripTypeChange('road')}
            className={cn(
              'relative cursor-pointer px-6 py-3 text-sm font-medium transition-colors md:px-8 md:text-base',
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
              <Select value={origin} onValueChange={setOrigin}>
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
              <Select value={destination} onValueChange={setDestination}>
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
            <DateTimePicker value={departureDateTime} onChange={(date) => date && setDepartureDateTime(date)} placeholder="Select departure date & time" />
          </div>

          {/* Return - Only for Round Trip (both Flight and Road) */}
          {flightType === 'round-trip' && (
            <div className="flex flex-col">
              <Label className="mb-1.5 text-xs font-medium text-[#111111] md:text-sm">Return</Label>
              <DateTimePicker value={returnDateTime} onChange={(date) => date && setReturnDateTime(date)} placeholder="Select return date & time" />
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
              <Select value={travellers} onValueChange={setTravellers}>
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
              <span className="pointer-events-none absolute bottom-2 left-3 text-[10px] text-gray-400">{travellers} Adult</span>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full cursor-pointer rounded-md bg-ovu-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-ovu-secondary focus:outline-none focus:ring-2 focus:ring-ovu-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isSearching ? 'Searching...' : tripType === 'flight' ? 'Search Flights' : 'Search'}
          </button>
        </div>
      </div>
    </div>
  );
}
