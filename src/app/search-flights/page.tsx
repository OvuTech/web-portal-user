import { Header } from '@/components/layouts/Header';
import { SearchForm } from '@/components/features/SearchForm';
import { FlightResults } from '@/components/features/FlightResults';

export default function SearchFlightsPage() {
  return (
    <div className="min-h-screen bg-hero-bg">
      {/* Header */}
      <div className="pb-8 pt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <Header />

          {/* Search Form */}
          <div className="mt-6">
            <SearchForm />
          </div>
        </div>
      </div>

      {/* Countdown Bar */}
      <div className="bg-black py-4 text-center">
        <p className="text-sm text-white md:text-base">
          Please secure your booking within <span className="font-bold">00:30:00</span>
        </p>
      </div>

      {/* Flight Results */}
      <FlightResults />
    </div>
  );
}
