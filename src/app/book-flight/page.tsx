import { Header } from '@/components/layouts/Header';
import { FlightBooking } from '@/components/features/FlightBooking';
import { Countdown } from '@/components/ui/countdown';

export default function BookFlightPage() {
  return (
    <div className="min-h-screen bg-[#EBF4FF]">
      {/* Header */}
      <div className="pb-8 pt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <Header />
        </div>
      </div>

      {/* Countdown Bar */}
      <Countdown />

      {/* Booking Content */}
      <FlightBooking />
    </div>
  );
}
