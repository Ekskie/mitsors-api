'use client';

import { DashboardContent } from '@/app/components/dashboard-content';
import { RegionalPriceTable } from '@/app/components/regional-price-table';
import { SubmitPriceModal } from '@/app/components/submit-price-modal';
import { ThemeToggle } from '@/app/components/theme-toggle';
import { Footer } from '@/app/components/footer';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Dashboard Header */}
      <div className="border-b border-border bg-background/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-100">
                Market Dashboard
              </h1>
              <p className="text-muted-foreground">
                Monitor liveweight prices in your region
              </p>
            </div>
            <div className="flex gap-3">
              <SubmitPriceModal />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-12">
          {/* Aggregated Prices */}
          <DashboardContent />

          {/* Regional Overview */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-emerald-900 dark:text-emerald-100">
              Regional Market Overview
            </h2>
            <RegionalPriceTable />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
