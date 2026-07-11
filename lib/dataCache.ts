/* Tiny localStorage cache for admin catalog data.
   Pattern: paint from cache instantly, always revalidate in the background.
   A fetch that comes back empty never clobbers a non-empty cache — admin API
   errors surface as [] from lib/api.ts and must not wipe a good paint. */

const PREFIX = 'glya-cache:';

export function readCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeCache(key: string, data: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(data));
  } catch {
    /* quota / private mode — cache is best-effort */
  }
}

/** Stale-while-revalidate for list data: apply cached copy now, fetch fresh, re-apply. */
export function swrList<T>(key: string, fetcher: () => Promise<T[]>, apply: (data: T[]) => void): void {
  const cached = readCache<T[]>(key);
  const hadCache = Array.isArray(cached) && cached.length > 0;
  if (hadCache) apply(cached);
  fetcher().then(fresh => {
    if (fresh.length > 0) {
      apply(fresh);
      writeCache(key, fresh);
    } else if (!hadCache) {
      apply(fresh); // genuinely empty — still flip the loaded flag
    }
  });
}
