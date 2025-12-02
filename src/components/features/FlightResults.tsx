'use client';

import { useEffect, useState } from 'react';
import { SearchResults } from './SearchResults';
import type { SearchResponse, Route } from '@/lib/api/types';

// Format API Route to SearchResultItem
function formatRoute(route: Route, index: number) {
  // Determine cheapest and fastest from price and duration
  // This is a simple implementation - you might want to compare all results
  return {
    logo: route.provider_logo || '/airpeace.png',
    name: route.provider,
    code: route.flight_number || route.vehicle_number || 'N/A',
    duration: route.duration,
    stops: route.stops === 0 ? 'Non Stop' : `${route.stops} Stop${route.stops > 1 ? 's' : ''}`,
    luggage: route.baggage?.carry_on,
    bag: route.baggage?.checked,
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

// Fallback mock data
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
      location: 'Lagos, Murtala Muhammed International Airport',
    },
    travelTime: '1hrs 20mins',
    seatsLeft: 4,
    price: '₦200,000',
    badges: index === 0 ? { cheapest: true, fastest: true } : undefined,
  }));

export function FlightResults() {
  const [flightData, setFlightData] = useState(mockFlightData);
  const [totalCount, setTotalCount] = useState(10);

  useEffect(() => {
    // Get search results from sessionStorage
    const searchResultsStr = sessionStorage.getItem('searchResults');

    if (searchResultsStr) {
      try {
        const searchResults: SearchResponse = JSON.parse(searchResultsStr);

        // Format routes for display
        const formattedResults = searchResults.results.map((route, index) => formatRoute(route, index));

        setFlightData(formattedResults);
        setTotalCount(searchResults.total_results);
      } catch (error) {
        console.error('Error parsing search results:', error);
        // Keep using mock data
      }
    }
  }, []);

  return <SearchResults type="flight" items={flightData} totalCount={totalCount} buttonText="Book Now" />;
}
