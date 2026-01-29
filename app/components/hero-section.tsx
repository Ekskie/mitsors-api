'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WizardModal } from './wizard-modal';
import { TrendingUp, BarChart3, MapPin, Shield } from 'lucide-react';
import { PigAnimation } from './pig-animation';

export function HeroSection() {
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left column - Main content */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4 text-center sm:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                  Real-Time
                  <br />
                  <span className="text-emerald-200">Livestock Prices</span>
                </h1>
                <p className="text-lg text-emerald-50 sm:text-xl md:text-2xl">
                  Track live market prices, submit your rates, and make informed
                  decisions with the Philippines' most trusted livestock pricing
                  platform.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => setWizardOpen(true)}
                  className="cursor-pointer bg-white text-emerald-700 hover:bg-emerald-50 text-lg font-semibold px-8 py-6 h-auto"
                >
                  Check Prices
                  <TrendingUp className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="cursor-pointer border-2 border-white bg-transparent text-white hover:bg-white/10 text-lg font-semibold px-8 py-6 h-auto"
                >
                  Learn More
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-6 pt-4 justify-center sm:justify-start">
                <div className="flex items-center gap-2 text-emerald-50">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-medium">Verified Data</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-50">
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Nationwide Coverage
                  </span>
                </div>
                <div className="flex items-center gap-2 text-emerald-50">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm font-medium">Real-Time Updates</span>
                </div>
              </div>
            </div>

            {/* Right column - Feature cards */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div
                className="rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-transform hover:scale-105
                flex flex-col items-center text-center
                sm:items-start sm:text-left"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  Live Prices
                </h3>
                <p className="text-sm text-emerald-50">
                  Access real-time pricing data from markets across the
                  Philippines
                </p>
              </div>

              <div
                className="rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-transform hover:scale-105
                flex flex-col items-center text-center
                sm:items-start sm:text-left"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  Regional Insights
                </h3>
                <p className="text-sm text-emerald-50">
                  Compare prices across different regions to find the best deals
                </p>
              </div>

              <div
                className="rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-transform hover:scale-105
                flex flex-col items-center text-center
                sm:items-start sm:text-left"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  Market Trends
                </h3>
                <p className="text-sm text-emerald-50">
                  Analyze historical data and predict future price movements
                </p>
              </div>

              <div
                className="rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-transform hover:scale-105
                flex flex-col items-center text-center
                sm:items-start sm:text-left"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  Verified Data
                </h3>
                <p className="text-sm text-emerald-50">
                  Trust in our community-verified pricing information
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 -bottom-6 sm:-bottom-4">
          <PigAnimation className="h-28 sm:h-32 md:h-36 w-full" />
        </div>
      </section>

      <WizardModal open={wizardOpen} onOpenChange={setWizardOpen} />
    </>
  );
}
