import { Footer } from '@/components/layouts/Footer';
import { HeroSection } from '@/components/features/HeroSection';
import { OffersSection } from '@/components/features/OffersSection';
import { AppDownloadSection } from '@/components/features/AppDownloadSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <OffersSection />
        <div className="bg-white">
          <AppDownloadSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
