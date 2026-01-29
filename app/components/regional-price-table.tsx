'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  useRegionalPrices,
  type RegionalPrice,
} from '@/hooks/use-regional-prices';
import { useUserProfile } from '@/hooks/use-user-profile';
import { cn } from '@/lib/utils';
import { philippineRegions } from '@/constants/philippine-locations';

type SortBy =
  | 'region'
  | 'verifiedAverage'
  | 'unverifiedAverage'
  | 'lastUpdated';

function PriceTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

function SortHeader({
  label,
  sortKey,
  currentSort,
  currentOrder,
  onSort,
}: {
  label: string;
  sortKey: SortBy;
  currentSort: SortBy;
  currentOrder: 'asc' | 'desc';
  onSort: (key: SortBy) => void;
}) {
  const isActive = currentSort === sortKey;
  const Icon = isActive && currentOrder === 'asc' ? ChevronUp : ChevronDown;

  return (
    <button
      onClick={() => onSort(sortKey)}
      className={cn(
        'flex items-center gap-1 font-semibold hover:text-primary transition-colors',
        isActive ? 'text-primary' : 'text-muted-foreground',
      )}
    >
      {label}
      <Icon className="h-4 w-4" />
    </button>
  );
}

export function RegionalPriceTable() {
  const [sortBy, setSortBy] = useState<SortBy>('region');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: profile, isLoading: isLoadingProfile } = useUserProfile();
  const { data, isLoading } = useRegionalPrices(sortBy, order);

  const TOTAL_REGIONS = philippineRegions.length;

  const handleSort = (key: SortBy) => {
    if (sortBy === key) {
      // Toggle order if clicking the same column
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, reset to ascending
      setSortBy(key);
      setOrder('asc');
    }
  };

  const userRegion = profile?.region;
  const isHighlighted = (region: string) => region === userRegion;

  // Filter regions based on search query
  const filteredRegions =
    data?.regions.filter((region: RegionalPrice) =>
      region.region.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  if (isLoading || isLoadingProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Regional Price Overview</CardTitle>
          <CardDescription>
            Liveweight prices across all {TOTAL_REGIONS} Philippine regions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PriceTableSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.regions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Regional Price Overview</CardTitle>
          <CardDescription>
            Liveweight prices across all 17 Philippine regions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-6">
            <p className="text-sm text-muted-foreground">
              No price data available yet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle>Regional Price Overview</CardTitle>
            <CardDescription>
              Liveweight prices across all {TOTAL_REGIONS} Philippine regions
              {userRegion && ` • Your region: ${userRegion}`}
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">
                  <SortHeader
                    label="Region"
                    sortKey="region"
                    currentSort={sortBy}
                    currentOrder={order}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="text-right">
                  <SortHeader
                    label="Verified Avg"
                    sortKey="verifiedAverage"
                    currentSort={sortBy}
                    currentOrder={order}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="text-center text-xs text-muted-foreground">
                  Sample
                </TableHead>
                <TableHead className="text-right">
                  <SortHeader
                    label="Unverified Avg"
                    sortKey="unverifiedAverage"
                    currentSort={sortBy}
                    currentOrder={order}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="text-center text-xs text-muted-foreground">
                  Sample
                </TableHead>
                <TableHead className="text-right">
                  <SortHeader
                    label="Last Updated"
                    sortKey="lastUpdated"
                    currentSort={sortBy}
                    currentOrder={order}
                    onSort={handleSort}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegions.map((region: RegionalPrice) => (
                <TableRow
                  key={region.region}
                  className={cn(
                    'transition-colors',
                    isHighlighted(region.region)
                      ? 'bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900'
                      : 'hover:bg-muted/50',
                  )}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {isHighlighted(region.region) && (
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                      {region.region}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {region.verifiedAverage !== null ? (
                      <span className="font-semibold">
                        ₱{region.verifiedAverage.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {region.verifiedSampleSize}
                  </TableCell>
                  <TableCell className="text-right">
                    {region.unverifiedAverage !== null ? (
                      <span className="font-semibold">
                        ₱{region.unverifiedAverage.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {region.unverifiedSampleSize}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(region.lastUpdated).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: '2-digit',
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredRegions.length === 0 && searchQuery && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            No regions found matching &quot;{searchQuery}&quot;
          </div>
        )}
        <div className="mt-4 text-xs text-muted-foreground">
          {filteredRegions.length > 0
            ? `${data.regionsWithData} of ${TOTAL_REGIONS} regions with data`
            : `0 of ${TOTAL_REGIONS} regions with data`}
        </div>
      </CardContent>
    </Card>
  );
}
