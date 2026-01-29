'use client';

import { useState, useMemo, useCallback } from 'react';
import { philippineRegions } from '@/constants/philippine-locations';

/**
 * Hook for managing cascading location selection (Region -> City)
 * 
 * Features:
 * - Provides all available regions
 * - Provides cities filtered by selected region
 * - Manages region and city selections
 * - Automatically resets city when region changes
 * - Memoizes derived city list to prevent unnecessary re-renders
 * 
 * @returns Object containing:
 *  - regions: All available Philippine regions
 *  - cities: Cities filtered by selected region (empty array if no region selected)
 *  - selectedRegion: Currently selected region code
 *  - selectedCity: Currently selected city name
 *  - setSelectedRegion: Function to update selected region
 *  - setSelectedCity: Function to update selected city
 *  - isCityDisabled: Boolean indicating if city dropdown should be disabled
 */
export function useLocation() {
  const [selectedRegion, setSelectedRegionState] = useState<string>('');
  const [selectedCity, setSelectedCityState] = useState<string>('');

  // Memoized derived city list - only recomputed when selectedRegion changes
  const cities = useMemo(() => {
    if (!selectedRegion) return [];
    
    const region = philippineRegions.find((r) => r.code === selectedRegion);
    return region?.cities || [];
  }, [selectedRegion]);

  // Handle region selection with automatic city reset
  const setSelectedRegion = useCallback((regionCode: string) => {
    setSelectedRegionState(regionCode);
    // Reset city selection when region changes to prevent invalid pairs
    setSelectedCityState('');
  }, []);

  // Handle city selection
  const setSelectedCity = useCallback((cityName: string) => {
    setSelectedCityState(cityName);
  }, []);

  // City dropdown is disabled until a region is selected
  const isCityDisabled = !selectedRegion || cities.length === 0;

  return {
    regions: philippineRegions,
    cities,
    selectedRegion,
    selectedCity,
    setSelectedRegion,
    setSelectedCity,
    isCityDisabled,
  };
}
