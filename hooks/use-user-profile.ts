import { useState, useEffect } from 'react';
import { authClient } from '@/lib/api/auth-client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  region?: string;
  municipality?: string; // API uses municipality
  userRoles: string[];
}

export function useUserProfile() {
  const { data: session, isPending } = authClient.useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // 1. Fetch User Profile
  useEffect(() => {
    async function fetchProfile() {
      if (!session?.user) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        // In a real app, you might fetch from /api/v1/users/profile here
        // For now, we rely on the session data populated by better-auth
        // or a dedicated fetch if session is incomplete.

        // Simulating API structure based on session
        const userData = session.user as unknown as UserProfile;

        setUser({
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
          region: userData.region || '',
          municipality: userData.municipality || '', // Ensure mapping
          userRoles: userData.userRoles || [],
        });
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isPending) {
      fetchProfile();
    }
  }, [session, isPending]);

  // 2. Update Profile Function (Task D-1 PATCH)
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      // Optimistic update
      setUser((prev) => (prev ? { ...prev, ...updates } : null));

      // Call API
      // const res = await fetch('/api/v1/users/profile', { method: 'PATCH', body: JSON.stringify(updates) });
      // if (!res.ok) throw new Error('Failed to update');

      // For now, simulate success
      return true;
    } catch (error) {
      // Revert on failure logic would go here
      throw error;
    }
  };

  return {
    user,
    isLoading: isLoading || isPending,
    updateProfile,
  };
}
