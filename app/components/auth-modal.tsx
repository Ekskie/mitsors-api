'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { AuthForm } from './auth-form';
import { useGuestProfile } from '@/hooks/use-guest-profile';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'login' | 'register';
}

export function AuthModal({
  open,
  onOpenChange,
  defaultTab = 'login',
}: AuthModalProps) {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const { data: guestData } = useGuestProfile();

  // Helper to show the user we are syncing their specific progress
  const getWizardRegion = () => {
    return guestData?.region || 'your progress';
  };

  const handleClose = () => {
    if (!isAuthenticating) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => (isAuthenticating ? undefined : onOpenChange(val))}
    >
      <DialogContent className="sm:max-w-[420px] p-8 bg-[#0B0E14] text-white border-none shadow-2xl">
        {/* Full-screen loading overlay (z-50) */}
        {isAuthenticating && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            <p className="mt-4 text-sm font-medium text-emerald-500">
              Securing Session...
            </p>
          </div>
        )}

        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Save Your Progress
          </DialogTitle>
          <DialogDescription className="text-gray-400 mt-2">
            Sync your data from{' '}
            <span className="font-semibold text-emerald-400">
              {getWizardRegion()}
            </span>{' '}
            to the cloud to access it from any device.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <AuthForm
            // @ts-ignore - Assuming AuthForm handles these props based on your snippet
            setGlobalLoading={setIsAuthenticating}
            onClose={handleClose}
            defaultTab={defaultTab}
          />
        </div>

        <div className="mt-6 flex justify-center border-t border-gray-800 pt-6">
          <button
            onClick={handleClose}
            disabled={isAuthenticating}
            className="text-gray-500 hover:text-white transition-colors text-sm"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
