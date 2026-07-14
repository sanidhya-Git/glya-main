import { priceOf, type MetalRates } from './catalog';
import { adminToStorefront } from './api';

const ADMIN_BASE =
  process.env.NEXT_PUBLIC_GLYA_API_BASE ??
  process.env.NEXT_PUBLIC_ADMIN_API ??
  'http://localhost:3001';

export interface ServerCartItem { id: number; karat: string; qty: number }

export interface ServerTotals {
  total:    number;
  subtotal: number;
  discount: number;
  error?:   string;
}

export async function computeServerTotal(
  cartItems: ServerCartItem[],
  opts: { couponCode?: string; giftWrap?: boolean; insurance?: boolean },
): Promise<ServerTotals> {
  const empty = (error: string): ServerTotals => ({ total: 0, subtotal: 0, discount: 0, error });

  if (!Array.isArray(cartItems) || cartItems.length === 0) return empty('Cart is empty');

  for (const item of cartItems) {
    if (!Number.isInteger(item.id) || item.id <= 0)          return empty('Invalid product ID');
    if (!item.karat || typeof item.karat !== 'string')        return empty('Invalid karat');
    if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 10) return empty('Invalid quantity');
  }

  const [prodsRes, pricingRes] = await Promise.all([
    fetch(`${ADMIN_BASE}/api/products?status=Active`, { cache: 'no-store' }),
    fetch(`${ADMIN_BASE}/api/pricing`,                { cache: 'no-store' }),
  ]);

  if (!prodsRes.ok) return empty('Could not fetch product data');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawProds: any[] = await prodsRes.json();
  const pricing = pricingRes.ok ? await pricingRes.json() : {};
  const p = pricing as { goldRate24k?: number; silverRate?: number; platinumRate?: number };

  const rates: MetalRates = {
    gold:     p.goldRate24k  ?? 7180,
    silver:   p.silverRate   ?? 94,
    platinum: p.platinumRate ?? 3380,
  };

  const products = rawProds.map(adminToStorefront);

  let subtotal = 0;
  for (const item of cartItems) {
    const prod = products.find(x => x.id === item.id);
    if (!prod) return empty(`Product ${item.id} is no longer available`);
    const pr = priceOf(prod, item.karat, rates);
    subtotal += pr.total * item.qty;
  }

  let discount = 0;
  const coupon = opts.couponCode?.trim();
  if (coupon && subtotal > 0) {
    try {
      const promoRes = await fetch(`${ADMIN_BASE}/api/promos/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon, orderTotal: subtotal }),
        cache: 'no-store',
      });
      if (promoRes.ok) {
        const promo = await promoRes.json() as { valid?: boolean; discount?: number };
        if (promo.valid) discount = Math.min(promo.discount ?? 0, subtotal);
      }
    } catch { /* promo errors are non-fatal; proceed without discount */ }
  }

  const wrapCost = opts.giftWrap  ? 299 : 0;
  const insCost  = opts.insurance ? 499 : 0;
  const total    = subtotal - discount + wrapCost + insCost;

  return { total, subtotal, discount };
}
