'use client';

export function getAuthToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return localStorage.getItem('session_token') || undefined;
  } catch {
    return undefined;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  // Always use relative paths - Next.js rewrites will proxy to backend via API_BASE_URL
  const url = path;

  const headers = new Headers(init?.headers);
  if (init?.json !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const res = await fetch(url, {
      method: init?.method ?? 'GET',
      headers,
      body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
      credentials: 'include',
    });

    if (!res.ok) {
      try {
        const err = await res.json();
        const message = err?.message || err?.error || 'Request failed';
        throw new Error(message);
      } catch {
        const text = await res.text().catch(() => 'Request failed');
        throw new Error(text || 'Request failed');
      }
    }

    return res.json() as Promise<T>;
  } catch (error) {
    console.error(`[API Error] ${init?.method || 'GET'} ${url}:`, error);
    throw error;
  }
}
