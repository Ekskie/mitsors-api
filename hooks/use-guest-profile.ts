import { useState, useEffect, useCallback } from 'react';
import { GuestProfile } from '@/lib/types/location';

// Priority list of keys to check
const STORAGE_KEYS = [
  'mitsors-wizard-data', // Primary (User's original)
  'user_onboarding_data', // Refactor V1
  'guest_profile', // Legacy
];

export function useGuestProfile() {
  const [data, setData] = useState<GuestProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(() => {
    try {
      let foundData: any = null;

      // 1. Try finding valid data in any key
      for (const key of STORAGE_KEYS) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Handle Zustand structure: { state: { ... }, version: 0 }
          if (parsed.state) {
            foundData = parsed.state;
          } else {
            foundData = parsed;
          }
          if (foundData) break;
        }
      }

      if (foundData && (foundData.firstName || foundData.region)) {
        const normalized: GuestProfile = {
          firstName: foundData.firstName || '',
          lastName: foundData.lastName || '',
          phone: foundData.phone || '',
          region: foundData.region || '',
          // Map inconsistent city naming
          city: foundData.city || foundData.municipality || '',
          updatedAt: foundData.updatedAt || new Date().toISOString(),
        };
        setData(normalized);
      } else {
        setData(null);
      }
    } catch (e) {
      console.error('Failed to load guest profile', e);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = useCallback((newData: GuestProfile) => {
    try {
      // Save to the primary key using a flat structure for simplicity
      localStorage.setItem('mitsors-wizard-data', JSON.stringify(newData));

      // Clean up others to avoid confusion
      localStorage.removeItem('user_onboarding_data');

      setData(newData);
      // Notify other components
      window.dispatchEvent(new Event('guest-data-updated'));
    } catch (e) {
      console.error('Failed to save guest profile', e);
    }
  }, []);

  useEffect(() => {
    loadProfile();
    const handleStorageChange = () => loadProfile();

    // Listen for custom event and storage events (cross-tab)
    window.addEventListener('guest-data-updated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('guest-data-updated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadProfile]);

  return { data, loading, saveProfile, loadProfile };
}
