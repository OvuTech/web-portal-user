import { Header } from '@/components/layouts/Header';
import { RoadBooking } from '@/components/features/RoadBooking';
import { Countdown } from '@/components/ui/countdown';

export default function BookRoadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white pb-8 pt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <Header />
        </div>
      </div>

      {/* Countdown Bar */}
      <Countdown />

      {/* Booking Content */}
      <RoadBooking />
    </div>
  );
}
