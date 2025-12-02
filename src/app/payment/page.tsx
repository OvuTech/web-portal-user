'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { bookingService } from '@/lib/api/bookings';
import type { Booking } from '@/lib/api/types';

interface StoredPassenger {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | '';
  email: string;
  phone: string;
  kinName: string;
  kinPhone: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [route, setRoute] = useState<any>(null); // Store route details separately
  const [storedPassengers, setStoredPassengers] = useState<StoredPassenger[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Get booking from sessionStorage
    const bookingStr = sessionStorage.getItem('currentBooking');
    if (bookingStr && bookingStr !== 'undefined') {
      try {
        const bookingData = JSON.parse(bookingStr);
        setBooking(bookingData);
      } catch (error) {
        console.error('Error parsing booking:', error);
        // Silently fail - keep loading state
      }
    }

    // Get route details from sessionStorage (for display purposes)
    const routeStr = sessionStorage.getItem('selectedRoute');
    if (routeStr && routeStr !== 'undefined') {
      try {
        const routeData = JSON.parse(routeStr);
        setRoute(routeData);
      } catch (error) {
        console.error('Error parsing route:', error);
      }
    }

    // Get passengers from sessionStorage (filled in booking form)
    const passengersStr = sessionStorage.getItem('bookingPassengers');
    if (passengersStr && passengersStr !== 'undefined') {
      try {
        const passengersData = JSON.parse(passengersStr);
        setStoredPassengers(passengersData);
      } catch (error) {
        console.error('Error parsing passengers:', error);
      }
    }

    // Get selected seats from sessionStorage
    const seatsStr = sessionStorage.getItem('selectedSeats');
    if (seatsStr && seatsStr !== 'undefined') {
      try {
        const seatsData = JSON.parse(seatsStr);
        setSelectedSeats(seatsData);
      } catch (error) {
        console.error('Error parsing seats:', error);
      }
    }
    // If no booking, keep showing loading state (for development/testing)
  }, [router]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePay = async () => {
    if (!booking) return;

    setIsProcessing(true);
    try {
      const paymentResponse = await bookingService.initializePayment({
        booking_id: booking.id,
        callback_url: `${window.location.origin}/payment-success`,
      });

      if (paymentResponse.authorization_url) {
        window.location.href = paymentResponse.authorization_url;
      }
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast.error('Failed to initialize payment. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  const bookingFee = 3000;
  const totalAmount = booking.total_price + bookingFee;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Timer Bar */}
      <div className="bg-black py-3 text-center text-white">
        <p className="text-sm">
          Please secure your booking within <span className="font-semibold">{formatTime(timeLeft)}</span>
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-12">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Column - Payment Method */}
          <div className="flex-1">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">Select Payment Method</h2>

              {/* Paystack Option */}
              <div className="mb-4">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-ovu-primary bg-white p-4">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                    className="h-5 w-5 text-ovu-primary focus:ring-ovu-primary"
                  />
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                      <svg className="h-6 w-6 text-ovu-primary" fill="currentColor" viewBox="0 0 24 24">
                        <rect width="24" height="24" rx="4" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900">Paystack</span>
                  </div>
                </label>
                <div className="mt-3 rounded-lg bg-red-50 p-3">
                  <p className="text-sm text-red-600">
                    Receive your e-ticket instantly when you pay using transfer on Paystack.
                  </p>
                </div>
              </div>

              <p className="mb-6 text-sm text-gray-600">
                You will be redirected to our secure payment page. Please do not close your browser during this time.
                The process may take between 5 to 10 minutes to complete.
              </p>

              {/* Booking Fee */}
              <div className="mb-6 flex items-center justify-between border-t pt-4">
                <span className="text-lg font-semibold text-gray-900">Booking Fee</span>
                <span className="text-lg font-semibold text-gray-900">₦{bookingFee.toLocaleString()}</span>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full cursor-pointer rounded-lg bg-ovu-primary py-4 text-base font-semibold text-white transition-colors hover:bg-ovu-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Pay'}
              </button>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Booking Summary</h2>

              {/* Booking Reference */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">Booking Reference Number</p>
                <p className="font-semibold text-gray-900">{booking.booking_reference}</p>
              </div>

              {/* Route */}
              <h3 className="mb-3 font-semibold text-gray-900">
                {booking.origin.toUpperCase()} TO {booking.destination.toUpperCase()}
              </h3>

              {/* Provider */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-white">
                  <Image
                    src={route?.provider_logo || '/giglogistics.png'}
                    alt={route?.provider || 'Transport Provider'}
                    width={48}
                    height={48}
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{route?.provider || 'GIG Motors'}</p>
                  <p className="text-sm text-gray-600">
                    {route?.vehicle_number ? `Vehicle No: ${route.vehicle_number}` : 'Vehicle'}
                  </p>
                </div>
              </div>

              {/* Departure */}
              <div className="mb-3">
                <p className="text-xs text-gray-600">Departure</p>
                <p className="text-sm font-medium text-gray-900">
                  {booking.origin}
                </p>
                <p className="text-sm text-gray-600">
                  {route?.departure ? (
                    <>
                      {new Date(route.departure.time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}{' '}
                      |{' '}
                      {new Date(route.departure.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: '2-digit',
                      })}
                    </>
                  ) : (
                    new Date(booking.departure_date).toLocaleDateString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                      day: 'numeric',
                      month: 'short',
                      year: '2-digit',
                    })
                  )}
                </p>
              </div>

              {/* Arrival */}
              <div className="mb-4">
                <p className="text-xs text-gray-600">Arrival</p>
                <p className="text-sm font-medium text-gray-900">
                  {booking.destination}
                </p>
                <p className="text-sm text-gray-600">
                  {route?.arrival ? (
                    <>
                      {new Date(route.arrival.time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}{' '}
                      |{' '}
                      {new Date(route.arrival.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: '2-digit',
                      })}
                    </>
                  ) : (
                    'TBA'
                  )}
                </p>
              </div>

              {/* Duration and Passengers */}
              <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {route?.duration && <span>Est. {route.duration} | AC</span>}
                {selectedSeats.length > 0 && (
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      Seat No{selectedSeats.length > 1 ? 's' : ''} {selectedSeats.join(', ')}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>
                    {booking.total_passengers} {booking.total_passengers === 1 ? 'Adult' : 'Adults'}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="mb-4 border-t pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">TOTAL</span>
                  <span className="text-2xl font-bold text-ovu-primary">₦{totalAmount.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600">
                  FOR TRAVELLER X{booking.total_passengers}
                </p>
              </div>

              {/* Travellers */}
              {((booking.passengers && booking.passengers.length > 0) || storedPassengers.length > 0) && (
                <div className="mb-4 border-t pt-4">
                  <h4 className="mb-2 font-semibold text-gray-900">Travellers</h4>
                  {booking.passengers && booking.passengers.length > 0
                    ? booking.passengers.map((passenger, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          {index + 1}. {passenger.title} {passenger.first_name} {passenger.last_name}
                        </p>
                      ))
                    : storedPassengers.map((passenger, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          {index + 1}. {passenger.gender === 'male' ? 'Mr' : 'Mrs'} {passenger.firstName} {passenger.lastName}
                        </p>
                      ))}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="border-t pt-4">
                <h4 className="mb-3 font-semibold text-gray-900">Price Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adult x{booking.total_passengers}</span>
                    <span className="font-medium text-gray-900">₦{booking.total_price.toLocaleString()}</span>
                  </div>
                </div>

                {/* Add Ons */}
                <div className="mt-4 border-t pt-4">
                  <h4 className="mb-2 font-semibold text-gray-900">Add Ons</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Booking Fee</span>
                    <span className="font-medium text-gray-900">₦{bookingFee.toLocaleString()}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
