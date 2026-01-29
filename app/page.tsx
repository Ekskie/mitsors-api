'use client';

import { PriceTicker } from './components/price-ticker';
import { HeroSection } from './components/hero-section';
import { Footer } from './components/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Price Ticker */}
      <PriceTicker />

      {/* Hero Section */}
      <HeroSection />

      <Footer />
    </div>
  );
}
