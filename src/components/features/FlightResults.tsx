'use client';

import { useEffect, useState } from 'react';
import { SearchResults } from './SearchResults';
import { FlightRoundTripResults } from './FlightRoundTripResults';
import type { SearchResponse, Route } from '@/lib/api/types';

interface RoundTripFlightInfo {
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

// Format API Route to SearchResultItem (for one-way)
function formatRoute(route: Route, index: number) {
  return {
    logo: route.provider_logo || '/airpeace.png',
    name: route.provider,
    code: route.flight_number || route.vehicle_number || 'N/A',
    duration: route.duration,
    stops: route.stops === 0 ? 'Non Stop' : `${route.stops} Stop${route.stops > 1 ? 's' : ''}`,
    luggage: route.baggage?.carry_on || 'N/A',
    bag: route.baggage?.checked || 'N/A',
    departure: {
      date: `${new Date(route.departure.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} | ${new Date(route.departure.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}`,
      location: `${route.departure.location}${route.departure.terminal ? `, ${route.departure.terminal}` : ''}`,
    },
    arrival: {
      date: `${new Date(route.arrival.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} | ${new Date(route.arrival.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}`,
      location: `${route.arrival.location}${route.arrival.terminal ? `, ${route.arrival.terminal}` : ''}`,
    },
    travelTime: route.duration,
    seatsLeft: route.available_seats || 0,
    price: `${route.price.currency === 'NGN' ? '₦' : route.price.currency}${route.price.amount.toLocaleString()}`,
    badges: index === 0 ? { cheapest: true, fastest: true } : undefined,
  };
}

// Format API Route for round trip component
function formatRouteForRoundTrip(route: Route, index: number): RoundTripFlightInfo {
  return {
    id: route.id || `flight-${index}`,
    logo: route.provider_logo || '/airpeace.png',
    name: route.provider,
    code: route.flight_number || route.vehicle_number || 'N/A',
    duration: route.duration,
    stops: route.stops === 0 ? 'Non Stop' : `${route.stops} Stop${route.stops > 1 ? 's' : ''}`,
    luggage: route.baggage?.carry_on,
    bag: route.baggage?.checked,
    departureDate: `${new Date(route.departure.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} | ${new Date(route.departure.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}`,
    departureLocation: `${route.departure.location}${route.departure.terminal ? `, ${route.departure.terminal}` : ''}`,
    arrivalDate: `${new Date(route.arrival.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} | ${new Date(route.arrival.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}`,
    arrivalLocation: `${route.arrival.location}${route.arrival.terminal ? `, ${route.arrival.terminal}` : ''}`,
    travelTime: route.duration,
    price: route.price.amount,
  };
}

// Mock data for one-way flights
const mockFlightData = Array(10)
  .fill(null)
  .map((_, index) => ({
    logo: '/airpeace.png',
    name: 'Air Peace',
    code: 'P47130',
    duration: '1hr 20min',
    stops: 'Non Stop',
    luggage: '7kg',
    bag: '15kg',
    departure: {
      date: '19:00 | 28 Sep 25',
      location: 'Lagos, Murtala Muhammed International Airport',
    },
    arrival: {
      date: '19:00 | 28 Sep 25',
      location: 'Abuja, Nnamdi Azikiwe International Airport',
    },
    travelTime: '1hrs 20mins',
    seatsLeft: 4,
    price: '₦200,000',
    badges: index === 0 ? { cheapest: true, fastest: true } : undefined,
  }));

// Mock data for round trip flights
const mockRoundTripFlights: RoundTripFlightInfo[] = Array(10)
  .fill(null)
  .map((_, index) => ({
    id: `flight-${index}`,
    logo: '/airpeace.png',
    name: 'Air Peace',
    code: 'P47130',
    duration: '1hr 20min',
    stops: 'Non Stop',
    luggage: '7kg',
    bag: '15kg',
    departureDate: '19:00 | 28 Sep 25',
    departureLocation: 'Lagos, Murtala Muhammed International Airport',
    arrivalDate: '19:00 | 28 Sep 25',
    arrivalLocation: 'Abuja, Nnamdi Azikiwe International Airport',
    travelTime: '1hrs 20mins',
    price: 200000,
  }));

export function FlightResults() {
  const [flightData, setFlightData] = useState(mockFlightData);
  const [totalCount, setTotalCount] = useState(10);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [outboundFlights, setOutboundFlights] = useState<RoundTripFlightInfo[]>(mockRoundTripFlights);
  const [returnFlights, setReturnFlights] = useState<RoundTripFlightInfo[]>(mockRoundTripFlights);
  const [origin, setOrigin] = useState('Lagos');
  const [destination, setDestination] = useState('Abuja');
  const [passengerCount, setPassengerCount] = useState(1);

  useEffect(() => {
    // Get search params to determine trip type
    const searchParamsStr = sessionStorage.getItem('searchParams');
    let tripType = 'one-way';
    let searchOrigin = 'Lagos';
    let searchDestination = 'Abuja';
    let passengers = 1;

    if (searchParamsStr) {
      try {
        const searchParams = JSON.parse(searchParamsStr);
        tripType = searchParams.tripType || 'one-way';
        searchOrigin = searchParams.from || 'Lagos';
        searchDestination = searchParams.to || 'Abuja';
        passengers = searchParams.passengers || 1;
        
        setOrigin(searchOrigin);
        setDestination(searchDestination);
        setPassengerCount(passengers);
        setIsRoundTrip(tripType === 'round-trip');
      } catch (error) {
        console.error('Error parsing search params:', error);
      }
    }

    // Get search results from sessionStorage
    const searchResultsStr = sessionStorage.getItem('searchResults');
    const returnResultsStr = sessionStorage.getItem('returnSearchResults');

    if (searchResultsStr) {
      try {
        const searchResults: SearchResponse = JSON.parse(searchResultsStr);

        if (tripType === 'round-trip') {
          // Format for round trip
          const formattedOutbound = searchResults.results.map((route, index) => 
            formatRouteForRoundTrip(route, index)
          );
          setOutboundFlights(formattedOutbound.length > 0 ? formattedOutbound : mockRoundTripFlights);

          // Get return flights
          if (returnResultsStr) {
            const returnResults: SearchResponse = JSON.parse(returnResultsStr);
            const formattedReturn = returnResults.results.map((route, index) => 
              formatRouteForRoundTrip(route, index)
            );
            setReturnFlights(formattedReturn.length > 0 ? formattedReturn : mockRoundTripFlights);
          } else {
            // Use same flights for return (swapped origin/destination)
            setReturnFlights(formattedOutbound.length > 0 ? formattedOutbound : mockRoundTripFlights);
          }
        } else {
          // Format for one-way
          const formattedResults = searchResults.results.map((route, index) => formatRoute(route, index));
          setFlightData(formattedResults.length > 0 ? formattedResults : mockFlightData);
          setTotalCount(searchResults.total_results);
        }
      } catch (error) {
        console.error('Error parsing search results:', error);
        // Keep using mock data
      }
    }
  }, []);

  // Render round trip or one-way based on trip type
  if (isRoundTrip) {
    return (
      <FlightRoundTripResults
        outboundFlights={outboundFlights}
        returnFlights={returnFlights}
        origin={origin}
        destination={destination}
        passengerCount={passengerCount}
      />
    );
  }

  return <SearchResults type="flight" items={flightData} totalCount={totalCount} buttonText="Book Now" />;
}
