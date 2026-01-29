'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Chrome, Facebook, Mail, AlertCircle } from 'lucide-react';
import { authClient } from '@/lib/api/auth-client';
import { useRouter } from 'next/navigation';
import { useGuestProfile } from '@/hooks/use-guest-profile';

interface AuthFormProps {
  setGlobalLoading?: (loading: boolean) => void;
  onClose?: () => void;
  defaultTab?: 'login' | 'register';
}

export function AuthForm({
  setGlobalLoading,
  onClose,
  defaultTab = 'login',
}: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(defaultTab === 'register');

  // Use the hook to get clean data (handles parsing/keys automatically)
  const { data: guestData, saveProfile } = useGuestProfile();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setGlobalLoading?.(true);

    try {
      if (isSignUp) {
        const payload = {
          email,
          password,
          name:
            `${guestData?.firstName || ''} ${guestData?.lastName || ''}`.trim() ||
            'User',
          callbackURL: '/dashboard',
          firstName: guestData?.firstName || '',
          lastName: guestData?.lastName || '',
          region: guestData?.region || '',
          // Standardize on 'city'
          city: guestData?.city || '',
        };

        const { error: authError } = await authClient.signUp.email(
          payload as any,
        );

        if (authError) throw authError;

        // Clear guest data after successful signup (optional, or keep for reference)
        // localStorage.removeItem('mitsors-wizard-data');

        onClose?.();
        router.push('/dashboard');
      } else {
        const { error: authError } = await authClient.signIn.email({
          email,
          password,
          callbackURL: '/dashboard',
        });

        if (authError) throw authError;
        onClose?.();
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
      setGlobalLoading?.(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    setGlobalLoading?.(true);

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: '/dashboard',
        // @ts-ignore
        additionalData: {
          firstName: guestData?.firstName || '',
          lastName: guestData?.lastName || '',
          region: guestData?.region || '',
          city: guestData?.city || '',
        },
      });
    } catch (err: any) {
      setError(`Failed to connect to ${provider}`);
      setIsLoading(false);
      setGlobalLoading?.(false);
    }
  };

  return (
    <div className="grid gap-6">
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/50 text-red-500 text-[11px] p-3 rounded-md">
          <AlertCircle className="h-3 w-3" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleFormSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2 text-left">
            <Label htmlFor="email" className="text-gray-400 text-[11px]">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={isLoading}
              className="bg-[#1A1D23] border-gray-800 text-white text-sm"
            />
          </div>
          <div className="grid gap-2 text-left">
            <Label
              htmlFor="password"
              title="Min. 8 characters"
              className="text-gray-400 text-[11px]"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-[#1A1D23] border-gray-800 text-white text-sm"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 w-full mt-2 text-white font-bold h-11"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </div>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-[11px] text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          {isSignUp
            ? 'Already have an account? Sign In'
            : 'New here? Create an account'}
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-800" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase">
          <span className="bg-[#0B0E14] px-2 text-gray-500 tracking-tighter">
            Social Sync
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          disabled={isLoading}
          className="border-gray-800 bg-transparent hover:bg-gray-900 text-white text-xs h-10"
          onClick={() => handleSocialAuth('google')}
        >
          <Chrome className="mr-2 h-3 w-3" /> Google
        </Button>
        <Button
          disabled={isLoading}
          style={{ backgroundColor: '#1877F2' }}
          className="text-white hover:opacity-90 border-none text-xs h-10"
          onClick={() => handleSocialAuth('facebook')}
        >
          <Facebook className="mr-2 h-3 w-3 fill-current" /> Facebook
        </Button>
      </div>
    </div>
  );
}
