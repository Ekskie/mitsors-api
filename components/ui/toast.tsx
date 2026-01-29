"use client";

import * as React from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function Toaster() {
  const { toasts, remove } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:max-w-md">
      {toasts.map((t: { id: string; type: 'success' | 'error' | 'info'; message: string }) => (
        <div
          key={t.id}
          className={cn(
            'relative flex items-start gap-3 rounded-md border p-3 shadow-md bg-background',
            t.type === 'success' && 'border-green-600/40',
            t.type === 'error' && 'border-destructive',
            t.type === 'info' && 'border-blue-600/40'
          )}
          role="status"
          aria-live="polite"
        >
          <div className="mt-0.5">
            {t.type === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
            {t.type === 'error' && <XCircle className="h-5 w-5 text-destructive" />}
            {t.type === 'info' && <Info className="h-5 w-5 text-blue-600" />}
          </div>
          <div className="flex-1 text-sm text-foreground">{t.message}</div>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => remove(t.id)}
            className="absolute right-2 top-2 rounded-xs p-1 text-muted-foreground/70 transition hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
