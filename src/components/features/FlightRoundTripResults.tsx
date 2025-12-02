'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plane } from 'lucide-react';

interface FlightInfo {
  id: string;
  logo: string;
  name: string;
  code: string;
  duration: string;
  stops: string;
  luggage?: string;
  bag?: string;
  departureDate: string;
  departureLocation: string;
  arrivalDate: string;
  arrivalLocation: string;
  travelTime: string;
  price: number;
}

interface FlightRoundTripResultsProps {
  outboundFlights: FlightInfo[];
  returnFlights: FlightInfo[];
  origin: string;
  destination: string;
  passengerCount: number;
}

export function FlightRoundTripResults({
  outboundFlights,
  returnFlights,
  origin,
  destination,
  passengerCount,
}: FlightRoundTripResultsProps) {
  const router = useRouter();
  const [selectedOutbound, setSelectedOutbound] = useState<FlightInfo | null>(
    outboundFlights.length > 0 ? outboundFlights[0] : null
  );
  const [selectedReturn, setSelectedReturn] = useState<FlightInfo | null>(
    returnFlights.length > 0 ? returnFlights[0] : null
  );
  const [activeTab, setActiveTab] = useState<'flight' | 'price'>('flight');

  const taxes = 27000; // Fixed taxes
  const outboundPrice = selectedOutbound?.price || 0;
  const returnPrice = selectedReturn?.price || 0;
  const totalPrice = (outboundPrice + returnPrice + taxes) * passengerCount;

  const handleBookNow = () => {
    if (!selectedOutbound || !selectedReturn) return;

    // Store selected flights in session
    sessionStorage.setItem('selectedOutboundFlight', JSON.stringify(selectedOutbound));
    sessionStorage.setItem('selectedReturnFlight', JSON.stringify(selectedReturn));
    sessionStorage.setItem('flightTripType', 'round-trip');

    router.push('/book-flight');
  };

  const FlightCard = ({
    flight,
    isSelected,
    onSelect,
  }: {
    flight: FlightInfo;
    isSelected: boolean;
    onSelect: () => void;
  }) => (
    <div
      className={`relative cursor-pointer rounded-lg bg-white p-4 shadow-sm transition-all ${
        isSelected ? 'ring-2 ring-ovu-primary' : 'hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      {/* Airline Info */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded border bg-white">
            <Image src={flight.logo} alt={flight.name} width={32} height={32} className="object-contain" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{flight.name}</p>
            <p className="text-xs text-gray-500">{flight.code}</p>
          </div>
        </div>
        <p className="text-xl font-bold text-ovu-primary">₦{flight.price.toLocaleString()}</p>
      </div>

      {/* Route Info */}
      <div className="flex items-center gap-2">
        {/* Departure */}
        <div className="flex-1 rounded bg-[#EBF4FF] p-2">
          <div className="flex items-start gap-1">
            <Plane className="mt-0.5 h-3 w-3 text-gray-600" />
            <div>
              <p className="text-[10px] text-gray-500">Departure</p>
              <p className="text-xs font-semibold text-gray-900">{flight.departureDate}</p>
              <p className="text-[10px] text-gray-600">{flight.departureLocation}</p>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="flex flex-col items-center px-2">
          <p className="text-[10px] text-gray-500">{flight.travelTime}</p>
          <div className="relative my-1 h-[1px] w-12">
            <div className="absolute left-0 top-0 h-full w-full border-t border-dashed border-gray-400"></div>
          </div>
          <p className="text-[10px] text-gray-600">{flight.stops}</p>
        </div>

        {/* Arrival */}
        <div className="flex-1 rounded bg-[#EBF4FF] p-2">
          <div className="flex items-start gap-1">
            <Plane className="mt-0.5 h-3 w-3 rotate-90 text-gray-600" />
            <div>
              <p className="text-[10px] text-gray-500">Arrival</p>
              <p className="text-xs font-semibold text-gray-900">{flight.arrivalDate}</p>
              <p className="text-[10px] text-gray-600">{flight.arrivalLocation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="mt-2 flex items-center gap-3 text-[10px] text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {flight.duration}
        </span>
        <span className="flex items-center gap-1">
          <Plane className="h-3 w-3" />
          {flight.stops}
        </span>
        {flight.luggage && (
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {flight.luggage}
          </span>
        )}
        {flight.bag && (
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
            </svg>
            {flight.bag}
          </span>
        )}
      </div>

      {/* Selection Indicator */}
      <div className="absolute bottom-4 right-4">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
            isSelected ? 'border-ovu-primary bg-ovu-primary' : 'border-gray-300 bg-white'
          }`}
        >
          {isSelected && (
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Timer Bar */}
      <div className="bg-ovu-primary py-3 text-center text-white">
        <p className="text-sm">
          Please secure your booking within <span className="font-semibold">00:30:00</span>
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex gap-6">
          {/* Left Side - Flight Lists */}
          <div className="flex flex-1 gap-4">
            {/* Outbound Flights */}
            <div className="flex-1">
              <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
                <h2 className="mb-1 text-lg font-semibold text-gray-900">
                  {origin.toUpperCase()} TO {destination.toUpperCase()}
                </h2>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Search Results</p>
                    <p className="text-sm text-gray-600">{outboundFlights.length} Flights found</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex cursor-pointer items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                      Filters
                    </button>
                    <button className="flex cursor-pointer items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 8h18m-7 4h7" />
                      </svg>
                      Cheapest
                    </button>
                  </div>
                </div>
              </div>

              <div className="max-h-[600px] space-y-3 overflow-y-auto pr-2">
                {outboundFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    isSelected={selectedOutbound?.id === flight.id}
                    onSelect={() => setSelectedOutbound(flight)}
                  />
                ))}
              </div>
            </div>

            {/* Return Flights */}
            <div className="flex-1">
              <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
                <h2 className="mb-1 text-lg font-semibold text-gray-900">
                  {destination.toUpperCase()} TO {origin.toUpperCase()}
                </h2>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Search Results</p>
                    <p className="text-sm text-gray-600">{returnFlights.length} Flights found</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex cursor-pointer items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                      Filters
                    </button>
                    <button className="flex cursor-pointer items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 8h18m-7 4h7" />
                      </svg>
                      Cheapest
                    </button>
                  </div>
                </div>
              </div>

              <div className="max-h-[600px] space-y-3 overflow-y-auto pr-2">
                {returnFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    isSelected={selectedReturn?.id === flight.id}
                    onSelect={() => setSelectedReturn(flight)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Round Trip Details */}
          <div className="w-[320px] flex-shrink-0">
            <div className="sticky top-4 rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">ROUND TRIP DETAILS</h2>

                {/* Total */}
                <div className="mb-4 rounded-lg bg-gray-50 p-4 text-center">
                  <p className="text-sm text-gray-600">TOTAL</p>
                  <p className="text-3xl font-bold text-ovu-primary">₦{totalPrice.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">FOR TRAVELLER X{passengerCount}</p>
                </div>

                <button
                  onClick={handleBookNow}
                  disabled={!selectedOutbound || !selectedReturn}
                  className="mb-6 w-full cursor-pointer rounded-lg bg-ovu-primary py-3 font-semibold text-white transition-colors hover:bg-ovu-secondary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Book Now
                </button>

                {/* Tabs */}
                <div className="mb-4 flex gap-2">
                  <button
                    onClick={() => setActiveTab('flight')}
                    className={`flex-1 cursor-pointer rounded-lg py-2 text-sm font-medium transition-colors ${
                      activeTab === 'flight'
                        ? 'bg-ovu-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Flight
                  </button>
                  <button
                    onClick={() => setActiveTab('price')}
                    className={`flex-1 cursor-pointer rounded-lg py-2 text-sm font-medium transition-colors ${
                      activeTab === 'price'
                        ? 'bg-ovu-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Price Breakdown
                  </button>
                </div>

                {activeTab === 'flight' ? (
                  <div className="space-y-4">
                    {/* Outbound Flight Summary */}
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-gray-900">
                        {origin.toUpperCase()} TO {destination.toUpperCase()}
                      </h3>
                      {selectedOutbound && (
                        <div className="rounded-lg border border-gray-200 p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded border bg-white">
                              <Image
                                src={selectedOutbound.logo}
                                alt={selectedOutbound.name}
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{selectedOutbound.name}</p>
                              <p className="text-xs text-gray-500">{selectedOutbound.code}</p>
                            </div>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-start gap-2">
                              <Plane className="mt-0.5 h-3 w-3 text-gray-500" />
                              <div>
                                <p className="text-gray-500">Departure</p>
                                <p className="font-medium text-gray-900">{selectedOutbound.departureDate}</p>
                                <p className="text-gray-600">{selectedOutbound.departureLocation}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Plane className="mt-0.5 h-3 w-3 rotate-90 text-gray-500" />
                              <div>
                                <p className="text-gray-500">Arrival</p>
                                <p className="font-medium text-gray-900">{selectedOutbound.arrivalDate}</p>
                                <p className="text-gray-600">{selectedOutbound.arrivalLocation}</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500">
                            <span>{selectedOutbound.travelTime} | Economy</span>
                            <span>•</span>
                            <span>{selectedOutbound.duration}</span>
                            <span>•</span>
                            <span>{selectedOutbound.stops}</span>
                            {selectedOutbound.luggage && (
                              <>
                                <span>•</span>
                                <span>{selectedOutbound.luggage}</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Return Flight Summary */}
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-gray-900">
                        {destination.toUpperCase()} TO {origin.toUpperCase()}
                      </h3>
                      {selectedReturn && (
                        <div className="rounded-lg border border-gray-200 p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded border bg-white">
                              <Image
                                src={selectedReturn.logo}
                                alt={selectedReturn.name}
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{selectedReturn.name}</p>
                              <p className="text-xs text-gray-500">{selectedReturn.code}</p>
                            </div>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-start gap-2">
                              <Plane className="mt-0.5 h-3 w-3 text-gray-500" />
                              <div>
                                <p className="text-gray-500">Departure</p>
                                <p className="font-medium text-gray-900">{selectedReturn.departureDate}</p>
                                <p className="text-gray-600">{selectedReturn.departureLocation}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Plane className="mt-0.5 h-3 w-3 rotate-90 text-gray-500" />
                              <div>
                                <p className="text-gray-500">Arrival</p>
                                <p className="font-medium text-gray-900">{selectedReturn.arrivalDate}</p>
                                <p className="text-gray-600">{selectedReturn.arrivalLocation}</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500">
                            <span>{selectedReturn.travelTime} | Economy</span>
                            <span>•</span>
                            <span>{selectedReturn.duration}</span>
                            <span>•</span>
                            <span>{selectedReturn.stops}</span>
                            {selectedReturn.luggage && (
                              <>
                                <span>•</span>
                                <span>{selectedReturn.luggage}</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">PRICE BREAKDOWN</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Adult x{passengerCount}</span>
                        <div className="text-right">
                          <span className="text-gray-500">To</span>
                          <span className="ml-4 font-medium text-gray-900">
                            ₦{(outboundPrice * passengerCount).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Adult x{passengerCount}</span>
                        <div className="text-right">
                          <span className="text-gray-500">Return</span>
                          <span className="ml-4 font-medium text-gray-900">
                            ₦{(returnPrice * passengerCount).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxes</span>
                        <span className="font-medium text-gray-900">₦{(taxes * passengerCount).toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between text-lg font-bold">
                          <span className="text-gray-900">Total</span>
                          <span className="text-ovu-primary">₦{totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

