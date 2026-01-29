'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';

export type RegionalPrice = {
  region: string;
  verifiedAverage: number | null;
  unverifiedAverage: number | null;
  priceChange: number | null;
  lastUpdated: string;
  verifiedSampleSize: number;
  unverifiedSampleSize: number;
};

export type RegionalPricesResponse = {
  regions: RegionalPrice[];
  totalRegions: number;
  regionsWithData: number;
  message?: string;
};

type SortBy = 'region' | 'verifiedAverage' | 'unverifiedAverage' | 'lastUpdated';

export function useRegionalPrices(sortBy: SortBy = 'region', order: 'asc' | 'desc' = 'asc') {
  return useQuery<RegionalPricesResponse>({
    queryKey: ['regional-prices', sortBy, order],
    queryFn: async () => {
      const params = new URLSearchParams({ sort: sortBy, order });
      return apiFetch<RegionalPricesResponse>(
        `/api/v1/prices/regional?${params}`
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
}
