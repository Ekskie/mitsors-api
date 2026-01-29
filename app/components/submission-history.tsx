'use client';

import { useSubmissions, Submission } from '@/hooks/use-submissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Removed missing Badge import
import { Button } from '@/components/ui/button';
import {
  Loader2,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';

export function SubmissionHistory() {
  const { data: submissions, isLoading, loadMore, hasMore } = useSubmissions();

  const getStatusColor = (status: Submission['status']) => {
    switch (status) {
      case 'verified':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'pending':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: Submission['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="w-3 h-3 mr-1" />;
      case 'pending':
        return <Clock className="w-3 h-3 mr-1" />;
      case 'rejected':
        return <XCircle className="w-3 h-3 mr-1" />;
    }
  };

  if (isLoading && submissions.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mb-4 opacity-20" />
            <p>No submissions found yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {submissions.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden transition-all hover:border-primary/50"
            >
              <div className="p-4 flex items-center justify-between">
                {/* Left: Price and Details */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      ₱{item.pricePerKg.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">/ kg</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {item.livestockType}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Right: Status Badge (Replaced with span) */}
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getStatusColor(item.status)}`}
                >
                  {getStatusIcon(item.status)}
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Trigger */}
      {hasMore && submissions.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={loadMore} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Loading...' : 'Load More History'}
          </Button>
        </div>
      )}
    </div>
  );
}
