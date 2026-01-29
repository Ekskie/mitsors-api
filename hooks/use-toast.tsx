'use client';

import * as React from 'react';

type ToastType = 'success' | 'error' | 'info';

export type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
};

type ToastContextValue = {
  toasts: ToastItem[];
  remove: (id: string) => void;
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
  };
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const timeoutsRef = React.useRef<Record<string, number>>({});

  const remove = React.useCallback((id: string) => {
    setToasts((prev: ToastItem[]) =>
      prev.filter((t: ToastItem) => t.id !== id),
    );
    const t = timeoutsRef.current[id];
    if (t) {
      window.clearTimeout(t);
      delete timeoutsRef.current[id];
    }
  }, []);

  const add = React.useCallback(
    (type: ToastType, message: string, duration = 3000) => {
      const id = Math.random().toString(36).slice(2);
      const item: ToastItem = { id, type, message, duration };
      setToasts((prev: ToastItem[]) => [...prev, item]);
      timeoutsRef.current[id] = window.setTimeout(() => remove(id), duration);
    },
    [remove],
  );

  const value = React.useMemo<ToastContextValue>(
    () => ({
      toasts,
      remove,
      toast: {
        success: (message: string, duration?: number) =>
          add('success', message, duration),
        error: (message: string, duration?: number) =>
          add('error', message, duration),
        info: (message: string, duration?: number) =>
          add('info', message, duration),
      },
    }),
    [add, remove, toasts],
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
