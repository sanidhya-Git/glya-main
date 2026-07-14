interface RateBucket { count: number; start: number }

const store = new Map<string, RateBucket>();

/** Returns true if the request is within limits, false if rate-limited. */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = store.get(key);
  if (!bucket || now - bucket.start > windowMs) {
    store.set(key, { count: 1, start: now });
    return true;
  }
  if (bucket.count >= max) return false;
  bucket.count++;
  return true;
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  const ip  = xff ? xff.split(',')[0].trim() : 'unknown';
  // Sanitise to prevent key injection
  return ip.replace(/[^a-zA-Z0-9.:[\]-]/g, '').slice(0, 45) || 'unknown';
}
