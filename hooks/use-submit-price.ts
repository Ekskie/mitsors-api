"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import type { SubmitPriceDto, SubmitPriceResponse } from '@/lib/api/types';

export function useSubmitPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitPriceDto) => {
      return apiFetch<SubmitPriceResponse>('/api/v1/prices/submit', {
        method: 'POST',
        json: payload,
      });
    },
    onSuccess: () => {
      // Invalidate all price-related queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['prices'] });
      queryClient.invalidateQueries({ queryKey: ['regional-prices'] });
    },
  });
}
