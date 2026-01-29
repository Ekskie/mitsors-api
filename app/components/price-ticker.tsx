'use client';

import Marquee from 'react-fast-marquee';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useRegionalPrices } from '@/hooks/use-regional-prices';
import { Skeleton } from '@/components/ui/skeleton';

export function PriceTicker() {
  const { data, isLoading, error } = useRegionalPrices('region', 'asc');

  if (isLoading) {
    return (
      <div className="bg-emerald-950/20 py-3">
        <div className="flex gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-6 w-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data?.regions || data.regions.length === 0) {
    return (
      <div className="bg-emerald-950/20 py-3 text-center text-sm text-muted-foreground">
        Live prices will appear here
      </div>
    );
  }

  const priceItems = data.regions
    .filter(
      (region) =>
        region.verifiedAverage !== null || region.unverifiedAverage !== null,
    )
    .map((region) => {
      const price = region.verifiedAverage || region.unverifiedAverage || 0;
      const change = region.priceChange || 0;
      const isPositive = change > 0;
      const isNegative = change < 0;

      return {
        region: region.region,
        price: price.toFixed(2),
        change: Math.abs(change).toFixed(2),
        isPositive,
        isNegative,
      };
    });

  return (
    <div className="bg-emerald-950/20 py-3">
      <Marquee gradient={false} speed={40} className="text-sm">
        {priceItems.map((item, index) => (
          <div
            key={`${item.region}-${index}`}
            className="mx-8 flex items-center gap-2 whitespace-nowrap"
          >
            <span className="font-semibold text-emerald-100">
              {item.region}:
            </span>
            <span className="text-lg font-bold text-emerald-50">
              ₱{item.price}/kg
            </span>
            {item.isPositive && (
              <span className="flex items-center gap-1 text-emerald-400">
                <TrendingUp className="h-4 w-4" />+{item.change}%
              </span>
            )}
            {item.isNegative && (
              <span className="flex items-center gap-1 text-red-400">
                <TrendingDown className="h-4 w-4" />-{item.change}%
              </span>
            )}
            {!item.isPositive && !item.isNegative && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Minus className="h-4 w-4" />
                0.00%
              </span>
            )}
          </div>
        ))}
      </Marquee>
    </div>
  );
}
