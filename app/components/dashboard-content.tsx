'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  History,
  UserCircle,
  PlusCircle,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useUserProfile } from '@/hooks/use-user-profile';
import { useGuestProfile } from '@/hooks/use-guest-profile';
import { usePricesAggregated } from '@/hooks/use-prices-aggregated';
import { ProfileView } from '@/app/components/profile-view';
import { SubmitPriceModal } from '@/app/components/submit-price-modal';
import { SubmissionHistory } from '@/app/components/submission-history';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Users } from 'lucide-react';

// --- Helper Components (Kept Inline for brevity, same as before) ---
function PriceCardSkeleton({
  variant,
}: {
  variant: 'verified' | 'unverified';
}) {
  const isVerified = variant === 'verified';
  return (
    <Card
      className={`transition-all duration-200 hover:scale-105 hover:shadow-lg ${isVerified ? 'border-primary/30 bg-primary/5' : 'border-muted-foreground/20 bg-muted/50'}`}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          {isVerified ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <Users className="h-5 w-5 text-muted-foreground" />
          )}
          <CardTitle className="text-lg">
            {isVerified ? 'Verified Trader Average' : 'Unverified User Average'}
          </CardTitle>
        </div>
        <CardDescription>
          <Skeleton className="h-4 w-48" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-12 w-40" />
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  );
}

function PriceCard({
  variant,
  priceData,
  region,
  city,
}: {
  variant: 'verified' | 'unverified';
  priceData: any;
  region: string;
  city: string;
}) {
  const isVerified = variant === 'verified';
  return (
    <Card
      className={`transition-all duration-200 hover:scale-105 hover:shadow-lg ${isVerified ? 'border-primary/30 bg-primary/5' : 'border-muted-foreground/20 bg-muted/50'}`}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          {isVerified ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <Users className="h-5 w-5 text-muted-foreground" />
          )}
          <CardTitle className="text-lg">
            {isVerified ? 'Verified Trader Average' : 'Unverified User Average'}
          </CardTitle>
        </div>
        <CardDescription>
          {region} • {city}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!priceData ? (
          <div className="text-sm font-semibold text-muted-foreground">
            No data available
          </div>
        ) : (
          <>
            <div className="mb-2 text-4xl font-bold">
              ₱{priceData.pricePerKg.toFixed(2)}
              <span className="ml-2 text-xl font-normal">/ kg</span>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Based on {priceData.sampleSize} price
              {priceData.sampleSize !== 1 ? 's' : ''}
            </div>
            <div className="mt-1 text-xs text-muted-foreground/80">
              Updated {new Date(priceData.lastUpdated).toLocaleDateString()}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function MarketOverview() {
  const { user, isLoading: isLoadingProfile } = useUserProfile();
  const { data: guestProfile, loading: isLoadingGuest } = useGuestProfile();

  const region = user?.region || guestProfile?.region;
  const city = user?.municipality || guestProfile?.city;

  const { data, isLoading: isLoadingPrices } = usePricesAggregated(
    region,
    city,
  );
  const isLoading =
    isLoadingProfile || isLoadingGuest || isLoadingPrices || !region || !city;

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        <PriceCardSkeleton variant="verified" />
        <PriceCardSkeleton variant="unverified" />
      </div>
    );
  }

  if (!data || !region || !city) {
    return (
      <div className="flex min-h-[200px] flex-col gap-4 rounded-lg border border-dashed p-6">
        <div className="text-sm text-muted-foreground">
          Unable to load price data. Please ensure your profile location is set.
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
      <PriceCard
        variant="verified"
        priceData={data.verifiedAverage}
        region={data.region}
        city={data.city}
      />
      <PriceCard
        variant="unverified"
        priceData={data.unverifiedAverage}
        region={data.region}
        city={data.city}
      />
    </div>
  );
}

export function DashboardContent() {
  const { user } = useUserProfile();
  const { data: guestProfile } = useGuestProfile();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const displayName = user?.firstName || guestProfile?.firstName || 'User';

  // RBAC: Check if user can submit
  // Logic: Allow Guests (to upsell) OR Authenticated users with specific roles
  const canSubmit =
    !user ||
    (user.userRoles &&
      (user.userRoles.includes('hog_raiser') ||
        user.userRoles.includes('trader')));

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {displayName}. Here&apos;s the latest livestock market
            data.
          </p>
        </div>

        {/* Role-Based Button Rendering */}
        {canSubmit ? (
          <Button
            onClick={() => setIsSubmitModalOpen(true)}
            className="w-full md:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit Price
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full md:w-auto opacity-50 cursor-not-allowed"
            title="Observers cannot submit prices"
          >
            <Lock className="mr-2 h-4 w-4" />
            Submit Price
          </Button>
        )}
      </div>

      <Tabs defaultValue="prices" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="prices">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Prices
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="profile">
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prices" className="space-y-6">
          <MarketOverview />
        </TabsContent>

        <TabsContent value="history">
          {/* Replaced Placeholder with Real Component */}
          <SubmissionHistory />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileView />
        </TabsContent>
      </Tabs>

      <SubmitPriceModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
}
