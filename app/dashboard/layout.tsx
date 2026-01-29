'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGuestProfile } from '@/hooks/use-guest-profile';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WizardModal } from '@/app/components/wizard-modal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: guestData, loading: guestLoading } = useGuestProfile();
  const { user: apiUser, isLoading: apiLoading } = useUserProfile();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // We are ready when hooks finish loading
  const isReady = !guestLoading && !apiLoading;
  // Authorized if we have EITHER guest data OR a logged-in user
  const isAuthorized = !!guestData || !!apiUser;

  if (!isReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // STOP THE LOOP: Instead of redirecting, show a "Setup Needed" screen
  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-muted/20 p-4 text-center">
        <div className="max-w-md space-y-6 rounded-xl border bg-card p-8 shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Setup Required
            </h1>
            <p className="text-muted-foreground">
              We need a bit of information to personalize your dashboard
              experience.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-700 font-semibold"
              onClick={() => setIsWizardOpen(true)}
            >
              Check Prices (Setup)
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
        <WizardModal open={isWizardOpen} onOpenChange={setIsWizardOpen} />
      </div>
    );
  }

  return <>{children}</>;
}
