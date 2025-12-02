'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plane } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { bookingService } from '@/lib/api/bookings';
import { useAuth } from '@/contexts/AuthContext';
import type { CreateBookingRequest } from '@/lib/api/types';

interface PassengerData {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | '';
}

export function FlightBooking() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [contactSaved, setContactSaved] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Multiple passenger fields
  const [passengers, setPassengers] = useState<PassengerData[]>([
    { firstName: '', lastName: '', gender: '' },
  ]);

  // Initialize passenger count from session storage
  useEffect(() => {
    const searchParamsStr = sessionStorage.getItem('searchParams');
    if (searchParamsStr) {
      try {
        const searchParams = JSON.parse(searchParamsStr);
        const count = searchParams.passengers || 1;
        setPassengerCount(count);
        setPassengers(
          Array.from({ length: count }, () => ({
            firstName: '',
            lastName: '',
            gender: '' as 'male' | 'female' | '',
          }))
        );
      } catch (error) {
        console.error('Error parsing search params:', error);
      }
    }
  }, []);

  const updatePassenger = (index: number, field: keyof PassengerData, value: string) => {
    setPassengers(prevPassengers => {
      const updatedPassengers = [...prevPassengers];
      updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
      return updatedPassengers;
    });
  };

  const handleSaveContact = () => {
    if (!email || !phone) {
      toast.error('Please fill in all contact details');
      return;
    }
    setContactSaved(true);
    toast.success('Contact details saved');
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

    if (!email || !phone) {
      toast.error('Please fill in all contact details');
      return;
    }

    // Check all passengers have details filled
    const allPassengersFilled = passengers.every(p => p.firstName && p.lastName && p.gender);
    if (!allPassengersFilled) {
      toast.error('Please fill in all passenger details');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get provider reference from session storage (set when user selects a flight)
      const providerReference = sessionStorage.getItem('selectedProviderReference') || 'temp-provider-ref';

      const bookingRequest: CreateBookingRequest = {
        provider_reference: providerReference,
        transport_type: 'flight',
        passengers: passengers.map(p => ({
          type: 'adult',
          title: p.gender === 'male' ? 'Mr' : 'Mrs',
          first_name: p.firstName,
          last_name: p.lastName,
          gender: p.gender as 'male' | 'female',
        })),
        metadata: {
          contact: {
            email: email,
            phone: phone,
            country_code: '+234',
          },
          whatsapp_notification: whatsappEnabled,
        },
      };

      // Create booking
      // Create booking - API returns booking directly
      const booking = await bookingService.createBooking(bookingRequest);

      // Store booking details
      sessionStorage.setItem('currentBooking', JSON.stringify(booking));
      
      // Store passengers for payment page display
      sessionStorage.setItem('bookingPassengers', JSON.stringify(passengers));

      // Navigate to payment page
      router.push('/payment');
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

  return (
    <div className="py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-[15px] px-4 sm:px-6 lg:flex-row lg:px-12">
        {/* Left Column - Booking Details */}
        <div className="flex-1 lg:max-w-[1074px]">
          {/* Flight Summary */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Flight Summary</h2>

              {/* Flight Info Icons - Top Right */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>1hr 20min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Plane className="h-4 w-4" />
                  <span>Non-stop</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span>7kg</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>15kg</span>
                </div>
              </div>
            </div>

            {/* Flight Route */}
            <div className="flex items-center gap-6">
              {/* Airline Logo and Info */}
              <div className="flex items-start gap-3">
                <div className="flex h-[80px] w-[80px] flex-shrink-0 items-center justify-center">
                  <Image src="/airpeace.png" alt="Air Peace" width={80} height={80} className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Air Peace</p>
                  <p className="text-sm text-gray-600">P47130</p>
                  <a href="#" className="text-sm text-ovu-primary hover:underline">
                    FARE RULES
                  </a>
                </div>
              </div>

              {/* Departure */}
              <div className="flex-1">
                <div className="flex items-start gap-2 rounded-lg bg-[#EBF4FF] p-4">
                  <Plane className="mt-1 h-5 w-5 flex-shrink-0 text-ovu-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600">Departure</p>
                    <p className="font-semibold text-gray-900">19:00 | 28 Sep 25</p>
                    <p className="text-xs text-gray-700">Lagos, Murtala Muhammed International Airport</p>
                  </div>
                </div>
              </div>

              {/* Travel Line */}
              <div className="flex flex-col items-center">
                <p className="mb-1 text-xs text-gray-500">1hrs 20mins</p>
                <div className="relative h-[1px] w-32">
                  <div className="absolute left-0 top-0 h-full w-full border-t border-dashed border-gray-400"></div>
                  <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gray-400"></div>
                  <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gray-400"></div>
                </div>
                <p className="mt-1 text-xs font-medium text-gray-700">Non Stop</p>
              </div>

              {/* Arrival */}
              <div className="flex-1">
                <div className="flex items-start gap-2 rounded-lg bg-[#EBF4FF] p-4">
                  <Plane className="mt-1 h-5 w-5 flex-shrink-0 rotate-90 text-ovu-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600">Arrival</p>
                    <p className="font-semibold text-gray-900">19:00 | 28 Sep 25</p>
                    <p className="text-xs text-gray-700">Abuja, Nnamdi Azikiwe International Airpo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details - Collapsible */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Contact Details</h2>

            {!contactSaved ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <div className="flex gap-2">
                      <div className="flex h-[48px] w-[80px] items-center gap-2 rounded-md border border-gray-300 bg-white px-3">
                        <Image src="/twemoji_flag-nigeria.png" alt="Nigeria" width={20} height={20} className="h-5 w-5 object-contain" />
                        <span className="text-sm">+234</span>
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="000 0000 000"
                        className="h-[48px] flex-1"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Example@email.com"
                      className="h-[48px]"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-[5px] bg-[#F5F5F5] px-4 py-3">
                  <label htmlFor="whatsapp" className="flex items-center gap-2 text-sm text-gray-900">
                    <svg className="h-[18.67px] w-[29.33px] text-[#60D669]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Get your E-Ticket via Whatsapp
                  </label>
                  <label htmlFor="whatsapp" className="relative inline-block h-6 w-11 cursor-pointer">
                    <input
                      type="checkbox"
                      id="whatsapp"
                      checked={whatsappEnabled}
                      onChange={(e) => setWhatsappEnabled(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="block h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-[#60D669]"></span>
                    <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"></span>
                  </label>
                </div>

                <button
                  onClick={handleSaveContact}
                  className="mt-4 rounded-md bg-ovu-primary px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ovu-secondary"
                >
                  Save
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#60D669]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  +234{phone} | {email}
                </span>
                <button
                  onClick={() => setContactSaved(false)}
                  className="ml-auto flex items-center gap-1 text-ovu-primary hover:underline"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
              </div>
            )}

          </div>

          {/* Traveller Information - Always show header, form only after save */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Traveller Information</h2>
              <span className="text-sm text-gray-600">
                {passengerCount} Adult{passengerCount > 1 ? 's' : ''}
              </span>
            </div>

            {contactSaved && (
              <>
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-600 flex items-start gap-2">
                    <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>
                      <span className="font-semibold">Avoid modification charges!</span>
                      <br />
                      The traveller name must be entered exactly as it appears on your government-issued ID or Passport.
                    </span>
                  </p>
                </div>

                {passengers.map((passenger, index) => (
              <div key={index} className={index > 0 ? 'mt-6 border-t pt-6' : ''}>
                <h3 className="mb-4 font-medium text-gray-900">Passenger {index + 1}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor={`passenger-firstname-${index}`} className="mb-2 block text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <Input
                      id={`passenger-firstname-${index}`}
                      type="text"
                      placeholder="First name"
                      className="h-[48px]"
                      value={passenger.firstName}
                      onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`passenger-lastname-${index}`} className="mb-2 block text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    <Input
                      id={`passenger-lastname-${index}`}
                      type="text"
                      placeholder="Last name"
                      className="h-[48px]"
                      value={passenger.lastName}
                      onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
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
                      className="h-[48px] w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-ovu-primary focus:outline-none focus:ring-1 focus:ring-ovu-primary"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
                ))}
              </>
            )}
          </div>

          {/* Add Ons */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Add Ons</h2>
              <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Safe and Comfortable Trip
              </span>
            </div>
          </div>

          {/* Terms and Condition */}
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
                <span className="text-2xl font-bold text-gray-900">₦{(427000 * passengerCount).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600">FOR {passengerCount} {passengerCount === 1 ? 'TRAVELLER' : 'TRAVELLERS'}</p>
            </div>

            <div className="mb-4 border-b pb-4">
              <h3 className="mb-3 font-semibold text-gray-900">Price Breakdown</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Adult x{passengerCount}</span>
                  <div className="text-right">
                    <p>To</p>
                    <p className="font-medium">₦{(200000 * passengerCount).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Adult x{passengerCount}</span>
                  <div className="text-right">
                    <p>Return</p>
                    <p className="font-medium">₦{(200000 * passengerCount).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-medium">₦{(27000 * passengerCount).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mb-4 border-b pb-4">
              <h3 className="mb-3 font-semibold text-gray-900">Add Ons</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Booking details via WhatsApp</span>
                <span className="font-medium">₦27,000</span>
              </div>
            </div>

            <div className="mb-6 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₦{(427000 * passengerCount).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
