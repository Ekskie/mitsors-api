'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import type { AggregatedPricesResponse } from '@/lib/api/types';

export function usePricesAggregated(region?: string, city?: string) {
  return useQuery<AggregatedPricesResponse>({
    queryKey: ['prices', region, city],
    queryFn: async () => {
      if (!region || !city) {
        throw new Error('Region and city are required');
      }
      
      const params = new URLSearchParams({ region, city });
      return apiFetch<AggregatedPricesResponse>(
        `/api/v1/prices/aggregated?${params}`
      );
    },
    enabled: Boolean(region && city),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
