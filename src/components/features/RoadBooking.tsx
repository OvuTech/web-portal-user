'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SeatSelection } from './SeatSelection';
import { bookingService } from '@/lib/api/bookings';
import { useAuth } from '@/contexts/AuthContext';
import type { CreateBookingRequest, Route } from '@/lib/api/types';

interface PassengerData {
  fullName: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | '';
  email: string;
  phone: string;
  kinName: string;
  kinPhone: string;
  nameSaved: boolean;
  contactSaved: boolean;
}

export function RoadBooking() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showSeatSelection, setShowSeatSelection] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  // Multiple passenger fields
  const [passengers, setPassengers] = useState<PassengerData[]>([
    {
      fullName: '',
      firstName: '',
      lastName: '',
      gender: '' as 'male' | 'female' | '',
      email: '',
      phone: '',
      kinName: '',
      kinPhone: '',
      nameSaved: false,
      contactSaved: false,
    },
  ]);

  // Initialize passenger count, passengers array, and route from session storage
  useEffect(() => {
    // Load search params
    const searchParamsStr = sessionStorage.getItem('searchParams');
    let count = 1;
    if (searchParamsStr) {
      try {
        const searchParams = JSON.parse(searchParamsStr);
        count = searchParams.passengers || 1;
      } catch (error) {
        console.error('Error parsing search params:', error);
      }
    }
    setPassengerCount(count);
    setPassengers(
      Array.from({ length: count }, () => ({
        fullName: '',
        firstName: '',
        lastName: '',
        gender: '' as 'male' | 'female' | '',
        email: '',
        phone: '',
        kinName: '',
        kinPhone: '',
        nameSaved: false,
        contactSaved: false,
      }))
    );

    // Load selected route
    const selectedRouteStr = sessionStorage.getItem('selectedRoute');
    if (selectedRouteStr) {
      try {
        const route = JSON.parse(selectedRouteStr);
        setSelectedRoute(route);
      } catch (error) {
        console.error('Error parsing selected route:', error);
        // Keep using mock data if route parsing fails
      }
    }
    // If no route is selected, component will use mock/fallback data
  }, [router]);

  const handleSeatContinue = (seats: number[]) => {
    setSelectedSeats(seats);
    setShowSeatSelection(false);
  };

  const handleSavePassengerName = (index: number) => {
    const passenger = passengers[index];
    const nameParts = passenger.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    if (!firstName || !lastName || !passenger.gender) {
      toast.error('Please fill in all passenger details (First name, Last name, and Gender)');
      return;
    }

    // Mark name as saved with parsed names
    setPassengers(prevPassengers => {
      const updatedPassengers = [...prevPassengers];
      updatedPassengers[index] = { 
        ...updatedPassengers[index], 
        firstName,
        lastName,
        nameSaved: true 
      };
      return updatedPassengers;
    });
  };

  const handleSavePassengerContact = (index: number) => {
    const passenger = passengers[index];
    
    if (!passenger.email || !passenger.phone || !passenger.kinName || !passenger.kinPhone) {
      toast.error('Please fill in all contact and next of kin details');
      return;
    }

    // Mark contact as saved
    setPassengers(prevPassengers => {
      const updatedPassengers = [...prevPassengers];
      updatedPassengers[index] = { 
        ...updatedPassengers[index], 
        contactSaved: true 
      };
      return updatedPassengers;
    });

    // Move to next passenger if there are more
    if (index < passengerCount - 1) {
      setCurrentPassengerIndex(index + 1);
    }
  };

  const handleEditPassengerName = (index: number) => {
    setPassengers(prevPassengers => {
      const updatedPassengers = [...prevPassengers];
      const passenger = updatedPassengers[index];
      // Restore fullName from firstName + lastName when editing
      updatedPassengers[index] = { 
        ...passenger, 
        fullName: `${passenger.firstName} ${passenger.lastName}`.trim(),
        nameSaved: false,
        contactSaved: false 
      };
      return updatedPassengers;
    });
    setCurrentPassengerIndex(index);
  };

  const handleEditPassengerContact = (index: number) => {
    setPassengers(prevPassengers => {
      const updatedPassengers = [...prevPassengers];
      updatedPassengers[index] = { 
        ...updatedPassengers[index], 
        contactSaved: false 
      };
      return updatedPassengers;
    });
    setCurrentPassengerIndex(index);
  };

  const updatePassenger = (index: number, field: keyof PassengerData, value: string) => {
    setPassengers(prevPassengers => {
      const updatedPassengers = [...prevPassengers];
      updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
      return updatedPassengers;
    });
  };

  const handleProceedToPayment = async () => {
    // Check if user is authenticated first
    if (!isAuthenticated) {
      toast.error('Please login to continue with your booking');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    // Check all passengers have completed both steps
    const allComplete = passengers.every(p => p.nameSaved && p.contactSaved);
    if (!allComplete) {
      toast.error('Please complete all passenger details');
      return;
    }

    setIsSubmitting(true);

    try {
      // Use selected route or fallback for testing
      const providerReference = selectedRoute?.provider_reference || 'mock-provider-ref';

      const bookingRequest: CreateBookingRequest = {
        provider_reference: providerReference,
        transport_type: 'bus',
        passengers: passengers.map(p => ({
          type: 'adult' as const,
          title: p.gender === 'male' ? 'Mr' : 'Mrs',
          first_name: p.firstName,
          last_name: p.lastName,
          gender: p.gender as 'male' | 'female',
          email: p.email,
          phone: p.phone,
        })),
        metadata: {
          contact: {
            email: passengers[0].email,
            phone: passengers[0].phone,
            country_code: '+234',
          },
          next_of_kin: {
            name: passengers[0].kinName,
            phone: passengers[0].kinPhone,
            country_code: '+234',
          },
          selected_seats: selectedSeats,
        },
      };

      // Create booking - API returns booking directly
      const booking = await bookingService.createBooking(bookingRequest);

      // Store booking data and show payment section
      setBookingData(booking);
      setShowPayment(true);
    } catch (error: any) {
      console.error('Booking failed:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.error || 'Failed to create booking. Please try again.';
      
      // Check if it's an auth error
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again to continue.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!bookingData) return;

    try {
      const response = await bookingService.initializePayment({
        booking_id: bookingData.id,
        payment_method: 'card',
      });

      if (response.authorization_url) {
        window.location.href = response.authorization_url;
      }
    } catch (error: any) {
      console.error('Payment initialization failed:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.error || 'Failed to initialize payment. Please try again.';
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again to continue.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // Show payment view after booking is created
  if (showPayment && bookingData) {
    const bookingFee = 3000;
    const totalAmount = bookingData.total_price + bookingFee;

    return (
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Payment Method */}
            <div className="lg:col-span-2">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Select Payment Method</h2>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg border-2 border-ovu-primary bg-blue-50 p-4">
                    <input
                      type="radio"
                      id="paystack"
                      checked
                      readOnly
                      className="h-5 w-5 text-ovu-primary"
                    />
                    <label htmlFor="paystack" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">Paystack</span>
                      </div>
                      <p className="text-sm text-gray-600">Pay securely with card, bank transfer, or USSD</p>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  className="mt-6 w-full rounded-lg bg-ovu-primary py-4 text-lg font-semibold text-white transition-colors hover:bg-ovu-secondary"
                >
                  Pay ₦{totalAmount.toLocaleString()}
                </button>
              </div>
            </div>

            {/* Right: Booking Summary */}
            <div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Booking Reference Number</p>
                  <p className="font-semibold text-gray-900">{bookingData.booking_reference}</p>
                </div>

                <h3 className="mb-3 font-semibold text-gray-900">
                  {bookingData.origin.toUpperCase()} TO {bookingData.destination.toUpperCase()}
                </h3>

                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-white">
                    <Image
                      src={selectedRoute?.provider_logo || '/giglogistics.png'}
                      alt={selectedRoute?.provider || 'Transport Provider'}
                      width={48}
                      height={48}
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedRoute?.provider || 'GIG Motors'}</p>
                    <p className="text-sm text-gray-600">
                      {selectedRoute?.vehicle_number ? `Vehicle No: ${selectedRoute.vehicle_number}` : 'Vehicle'}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-gray-600">Departure</p>
                  <p className="text-sm font-medium text-gray-900">{bookingData.origin}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(bookingData.departure_date).toLocaleString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                      day: 'numeric',
                      month: 'short',
                      year: '2-digit',
                    })}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-600">Arrival</p>
                  <p className="text-sm font-medium text-gray-900">{bookingData.destination}</p>
                </div>

                <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                  {selectedRoute?.duration && <span>Est. {selectedRoute.duration}</span>}
                  {selectedSeats && selectedSeats.length > 0 && (
                    <span>Seat No{selectedSeats.length > 1 ? 's' : ''} {selectedSeats.join(', ')}</span>
                  )}
                  <span>{bookingData.total_passengers} {bookingData.total_passengers === 1 ? 'Adult' : 'Adults'}</span>
                </div>

                <div className="mb-4 border-t pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">TOTAL</span>
                    <span className="text-2xl font-bold text-ovu-primary">₦{totalAmount.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600">FOR TRAVELLER X{bookingData.total_passengers}</p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="mb-3 font-semibold text-gray-900">Price Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Adult x{bookingData.total_passengers}</span>
                      <span className="font-medium text-gray-900">₦{bookingData.total_price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Fee</span>
                      <span className="font-medium text-gray-900">₦{bookingFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-ovu-primary">₦{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showSeatSelection && (
        <SeatSelection
          onClose={() => setShowSeatSelection(false)}
          onContinue={handleSeatContinue}
          passengerCount={passengerCount}
        />
      )}

      <div className="py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-[15px] px-4 sm:px-6 lg:flex-row lg:px-12">
        {/* Left Column - Booking Details */}
        <div className="flex-1 lg:max-w-[1074px]">
          {/* Trip Summary */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Trip Summary</h2>

            <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                {selectedSeats.length > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Seat No{selectedSeats.length > 1 ? 's' : ''} {selectedSeats.join(', ')}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{passengerCount} {passengerCount === 1 ? 'Adult' : 'Adults'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Provider Logo */}
              <div className="flex h-[100px] w-[100px] flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white">
                <Image
                  src={selectedRoute?.provider_logo || '/giglogistics.png'}
                  alt={selectedRoute?.provider || 'GIG Motors'}
                  width={100}
                  height={100}
                  className="object-contain p-2"
                />
              </div>

              {/* Trip Details */}
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{selectedRoute?.provider || 'GIG Motors'}</p>
                  <p className="text-sm text-gray-600">
                    {selectedRoute?.vehicle_number ? `Vehicle No: ${selectedRoute.vehicle_number}` : 'Vehicle No: 278'}
                  </p>
                  <a href="#" className="text-sm text-ovu-primary hover:underline">
                    FARE RULES
                  </a>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">Departure</p>
                  <p className="font-semibold text-gray-900">
                    {selectedRoute ? (
                      <>
                        {new Date(selectedRoute.departure.time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}{' '}
                        |{' '}
                        {new Date(selectedRoute.departure.date).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit',
                        })}
                      </>
                    ) : (
                      '08:00 AM | 1 Oct 25'
                    )}
                  </p>
                  <p className="text-xs text-gray-600">{selectedRoute?.departure.location || 'Lagos, Ajah'}</p>
                </div>

                <div className="flex flex-col items-center">
                  <p className="mb-1 text-xs text-gray-500">Est. {selectedRoute?.duration || '4hrs 20mins'}</p>
                  <div className="relative h-[1px] w-24">
                    <div className="absolute left-0 top-0 h-full w-full border-t border-dashed border-gray-400"></div>
                    <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gray-400"></div>
                    <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gray-400"></div>
                  </div>
                  <p className="mt-1 text-xs font-medium text-gray-700">Non Stop</p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">Arrival</p>
                  <p className="font-semibold text-gray-900">
                    {selectedRoute ? (
                      <>
                        {new Date(selectedRoute.arrival.time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}{' '}
                        |{' '}
                        {new Date(selectedRoute.arrival.date).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit',
                        })}
                      </>
                    ) : (
                      '02:00 PM | 1 Oct 25'
                    )}
                  </p>
                  <p className="text-xs text-gray-600">{selectedRoute?.arrival.location || 'Lagos, Ajah'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Passenger Details - Step by step flow */}
          {passengers.map((passenger, index) => {
            // Only show completed passengers and the current one being edited
            const isCompleted = passenger.nameSaved && passenger.contactSaved;
            const isCurrent = index === currentPassengerIndex;
            const shouldShow = isCompleted || isCurrent;

            if (!shouldShow) return null;

            return (
              <div key={index} className="mb-6 rounded-lg bg-white p-6 shadow-sm">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Passenger {index + 1} Details</h2>
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-5 w-5" />
                    {index + 1} of {passengerCount}
                  </span>
                </div>

                {/* Completed Passenger Summary */}
                {isCompleted && !isCurrent && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500 text-white">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{passenger.firstName} {passenger.lastName}</p>
                          <p className="text-sm text-gray-500">
                            {passenger.gender === 'male' ? 'Male' : 'Female'} | {passenger.email} | Kin: {passenger.kinName}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEditPassengerName(index)}
                        className="flex cursor-pointer items-center gap-1 text-sm text-ovu-primary hover:underline"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                  </div>
                )}

                {/* Current Passenger Form */}
                {isCurrent && (
                  <>
                    {/* Name & Gender Section */}
                    {!passenger.nameSaved ? (
                      <>
                        <p className="mb-4 text-sm text-gray-600">Please enter name as they appear on identification document</p>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor={`passenger-fullname-${index}`} className="mb-2 block text-sm font-medium text-gray-700">
                              Full Name
                            </Label>
                            <Input
                              id={`passenger-fullname-${index}`}
                              type="text"
                              placeholder="First name and Last name"
                              className="h-[48px]"
                              value={passenger.fullName}
                              onChange={(e) => updatePassenger(index, 'fullName', e.target.value)}
                            />
                          </div>

                          <div>
                            <Label htmlFor={`passenger-gender-${index}`} className="mb-2 block text-sm font-medium text-gray-700">
                              Gender
                            </Label>
                            <select
                              id={`passenger-gender-${index}`}
                              value={passenger.gender}
                              onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                              className="h-[48px] w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-ovu-primary focus:outline-none focus:ring-1 focus:ring-ovu-primary"
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSavePassengerName(index)}
                          className="mt-6 w-full cursor-pointer rounded-lg bg-[#3B5168] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2d3e51] focus:outline-none focus:ring-2 focus:ring-[#3B5168] focus:ring-offset-2"
                        >
                          Save Passenger {index + 1} Details
                        </button>

                        {/* Collapsed Contact Section */}
                        <div className="mt-6 border-t pt-4">
                          <div className="flex items-center justify-between text-gray-400">
                            <h3 className="font-medium">Contact and Next of Kin Details</h3>
                            <span className="text-sm">Complete above to continue</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Saved Name Summary */}
                        <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ovu-primary text-white">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{passenger.firstName} {passenger.lastName}</p>
                              <p className="text-sm text-gray-500">
                                {passenger.gender === 'male' ? 'Male' : 'Female'} | <span className="uppercase">ADULT</span>
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleEditPassengerName(index)}
                            className="flex cursor-pointer items-center gap-1 text-sm text-ovu-primary hover:underline"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit
                          </button>
                        </div>

                        {/* Contact and Next of Kin Section */}
                        <div className="border-t pt-4">
                          <h3 className="mb-2 font-semibold text-gray-900">Contact and Next of Kin Details</h3>
                          
                          {!passenger.contactSaved ? (
                            <>
                              <p className="mb-4 text-sm text-gray-600">We need contact details for booking confirmation</p>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <Label htmlFor={`email-${index}`} className="mb-2 block text-sm font-medium text-gray-700">
                                    Email Address
                                  </Label>
                                  <Input
                                    id={`email-${index}`}
                                    type="email"
                                    placeholder="example@email.com"
                                    className="h-[48px]"
                                    value={passenger.email}
                                    onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                                  />
                                </div>

                                <div>
                                  <Label htmlFor={`phone-${index}`} className="mb-2 block text-sm font-medium text-gray-700">
                                    Phone Number
                                  </Label>
                                  <div className="flex gap-2">
                                    <div className="flex h-[48px] w-[80px] items-center gap-2 rounded-md border border-gray-300 bg-white px-3">
                                      <Image src="/twemoji_flag-nigeria.png" alt="Nigeria" width={20} height={20} className="h-5 w-5 object-contain" />
                                      <span className="text-sm">+234</span>
                                    </div>
                                    <Input
                                      id={`phone-${index}`}
                                      type="tel"
                                      placeholder="000 0000 000"
                                      className="h-[48px] flex-1"
                                      value={passenger.phone}
                                      onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor={`kin-name-${index}`} className="mb-2 block text-sm font-medium text-gray-700">
                                    Next of Kin Name
                                  </Label>
                                  <Input
                                    id={`kin-name-${index}`}
                                    type="text"
                                    placeholder="First & Last Name"
                                    className="h-[48px]"
                                    value={passenger.kinName}
                                    onChange={(e) => updatePassenger(index, 'kinName', e.target.value)}
                                  />
                                </div>

                                <div>
                                  <Label htmlFor={`kin-phone-${index}`} className="mb-2 block text-sm font-medium text-gray-700">
                                    Next of Kin Phone
                                  </Label>
                                  <div className="flex gap-2">
                                    <div className="flex h-[48px] w-[80px] items-center gap-2 rounded-md border border-gray-300 bg-white px-3">
                                      <Image src="/twemoji_flag-nigeria.png" alt="Nigeria" width={20} height={20} className="h-5 w-5 object-contain" />
                                      <span className="text-sm">+234</span>
                                    </div>
                                    <Input
                                      id={`kin-phone-${index}`}
                                      type="tel"
                                      placeholder="000 0000 000"
                                      className="h-[48px] flex-1"
                                      value={passenger.kinPhone}
                                      onChange={(e) => updatePassenger(index, 'kinPhone', e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => handleSavePassengerContact(index)}
                                className="mt-6 w-full cursor-pointer rounded-lg bg-ovu-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-ovu-secondary focus:outline-none focus:ring-2 focus:ring-ovu-primary focus:ring-offset-2"
                              >
                                {index < passengerCount - 1 ? `Save & Continue to Passenger ${index + 2}` : 'Save Contact Details'}
                              </button>
                            </>
                          ) : (
                            <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 p-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500 text-white">
                                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Contact & Next of Kin Saved</p>
                                  <p className="text-sm text-gray-500">{passenger.email} | {passenger.kinName}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleEditPassengerContact(index)}
                                className="flex cursor-pointer items-center gap-1 text-sm text-ovu-primary hover:underline"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            );
          })}

          {/* Terms and Condition - Always visible */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Terms and condition</h2>
            <p className="mb-4 text-sm text-gray-600">
              By checking this box, you agree and accept that the passenger name(s), flight itinerary, baggage details, all
              travel documents and products that you or the person booking on your behalf selected are correct and valid. You
              also agree and accept the Terms and Conditions of OVU and its partners.
            </p>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 focus:ring-[#60D669]"
                style={{ accentColor: '#60D669' }}
              />
              <label htmlFor="terms" className="text-sm font-medium text-gray-900">
                I agree
              </label>
            </div>

            <button
              onClick={handleProceedToPayment}
              disabled={isSubmitting}
              className="mt-6 w-full cursor-pointer rounded-lg bg-ovu-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-ovu-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>

        {/* Right Column - Price Details */}
        <div className="w-full lg:w-[330px]">
          <div className="sticky top-8 rounded-[10px] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Price Details</h2>

            <div className="mb-4 rounded-lg bg-[#EBF4FF] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">TOTAL</span>
                <span className="text-2xl font-bold text-gray-900">
                  {selectedRoute?.price.currency === 'NGN' ? '₦' : (selectedRoute?.price.currency || '₦')}
                  {((selectedRoute?.price.amount || 30000) * passengerCount).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600">FOR {passengerCount} {passengerCount === 1 ? 'TRAVELLER' : 'TRAVELLERS'}</p>
            </div>

            <div className="mb-4 border-b pb-4">
              <h3 className="mb-3 font-semibold text-gray-900">Trip details</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Travellers</span>
                  <span className="font-medium">{passengerCount}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Seat Number(s)</span>
                  <span className="font-medium">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}</span>
                </div>
              </div>
            </div>

            <div className="mb-4 border-b pb-4">
              <h3 className="mb-3 font-semibold text-gray-900">Price Breakdown</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Adult x{passengerCount}</span>
                  <span className="font-medium">
                    {selectedRoute?.price.currency === 'NGN' ? '₦' : (selectedRoute?.price.currency || '₦')}
                    {((selectedRoute?.price.amount || 30000) * passengerCount).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium">₦0</span>
                </div>
              </div>
            </div>

            <div className="mb-6 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>
                {selectedRoute?.price.currency === 'NGN' ? '₦' : (selectedRoute?.price.currency || '₦')}
                {((selectedRoute?.price.amount || 30000) * passengerCount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
