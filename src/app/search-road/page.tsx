import { Header } from '@/components/layouts/Header';
import { SearchForm } from '@/components/features/SearchForm';
import { RoadResults } from '@/components/features/RoadResults';
import { Countdown } from '@/components/ui/countdown';

export default function SearchRoadPage() {
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
      <Countdown />

      {/* Road Results */}
      <RoadResults />
    </div>
  );
}
