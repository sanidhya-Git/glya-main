import type { Product } from './catalog';

const BASE = process.env.NEXT_PUBLIC_GLYA_API_BASE ?? process.env.NEXT_PUBLIC_ADMIN_API ?? 'http://localhost:3001';

interface AdminProductRaw {
  sku: string;
  name: string;
  cat: string;
  cat2?: string;
  cat3?: string;
  collection: string;
  metal: string;
  weight: number;
  making: number;
  gemType?: string;
  gemValue?: number;
  description?: string;
  tags?: string;
  status: string;
  images?: string[];
  stock?: number;
  priceNum?: number;
}

export interface AdminPost {
  id: string;
  title: string;
  category: string;
  author: string;
  status: string;
  date: string;
  views: number;
  featured: boolean;
  excerpt: string;
  slug: string;
  coverImage?: string;
  body?: string;
}

export interface AdminBanner {
  _id: string;
  title: string;
  imageUrl: string;
  link: string;
  /** Category name — clicking the banner opens /browse?cat=<category> unless a custom link is set. */
  category?: string;
  active: boolean;
  order: number;
}

/* catPath = [main, sub, product-category] names from the admin tree, e.g.
   ["Gold", "BK Gold", "Pendants"]. `cat` stays the deepest (display) name. */
export type StorefrontProduct = Product & { images?: string[]; stock?: number; catPath?: string[] };

function parseMetal(metal: string): { metal: string; karat: string } {
  const m = metal.trim();
  if (m === 'PT950' || m.toLowerCase().startsWith('platinum')) return { metal: 'Platinum', karat: 'PT950' };
  if (m.startsWith('DIA') || m.toLowerCase().startsWith('diamond')) return { metal: 'Diamond', karat: m.startsWith('DIA') ? m : 'DIA' };
  if (m === '18K' || m.includes('18')) return { metal: 'Gold', karat: '18K' };
  if (m === '22K' || m.includes('22')) return { metal: 'Gold', karat: '22K' };
  if (m === '925' || m.toLowerCase().includes('silver')) return { metal: 'Silver', karat: '925' };
  return { metal: m, karat: m };
}

function skuToId(sku: string): number {
  const parts = sku.split('-');
  return parseInt(parts[parts.length - 1], 10) || 0;
}

function firstTag(tags?: string): string {
  if (!tags) return '';
  return tags.split(',')[0].trim();
}

export function adminToStorefront(p: AdminProductRaw): StorefrontProduct {
  const { metal, karat } = parseMetal(p.metal);
  const catPath = [p.cat, p.cat2, p.cat3].map(s => (s ?? '').trim()).filter(Boolean);
  return {
    id: skuToId(p.sku),
    name: p.name || '',
    cat: catPath[catPath.length - 1] ?? '',
    catPath,
    col: p.collection || '',
    metal,
    karat,
    gem: p.gemType || '',
    gemValue: p.gemValue ?? 0,
    weightG: p.weight ?? 0,
    makingPct: (p.making ?? 0) / 100,
    tag: firstTag(p.tags),
    rating: 4.8,
    reviews: 0,
    blurb: p.description || '',
    images: p.images ?? [],
    stock: p.stock,
  };
}

export async function fetchAdminProducts(): Promise<StorefrontProduct[]> {
  try {
    const res = await fetch(`${BASE}/api/products?status=Active`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data: AdminProductRaw[] = await res.json();
    return data.map(adminToStorefront);
  } catch {
    return [];
  }
}

export async function fetchAdminPricing(): Promise<{ goldRate24k?: number; silverRate?: number; platinumRate?: number } | null> {
  try {
    const res = await fetch(`${BASE}/api/pricing`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchAdminJournal(): Promise<AdminPost[]> {
  try {
    const res = await fetch(`${BASE}/api/journal?status=Published`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data: AdminPost[] = await res.json();
    return data.filter(p => p.status === 'Published');
  } catch {
    return [];
  }
}

export async function fetchAdminBanners(): Promise<AdminBanner[]> {
  try {
    const res = await fetch(`${BASE}/api/banners?active=1`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data: AdminBanner[] = await res.json();
    return data.filter(b => b.active && b.imageUrl).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch {
    return [];
  }
}

export async function fetchAdminCategories(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE}/api/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export interface CategoryNode {
  name: string;
  slug: string;
  children?: CategoryNode[];
}

export async function fetchCategoryTree(): Promise<CategoryNode[]> {
  try {
    const res = await fetch(`${BASE}/api/categories?tree=1`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    // Older admin deployments return a plain string[] even with tree=1 — normalise to nodes.
    return data
      .filter(d => d != null)
      .map(d => typeof d === 'string'
        ? { name: d, slug: d.toLowerCase().replace(/\s+/g, '-'), children: [] }
        : d as CategoryNode);
  } catch {
    return [];
  }
}

/* ── Customer profile & saved addresses (admin Customer collection) ── */

export interface SavedAddress {
  _id?: string;
  label?: string;
  def?: boolean;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;      // display name, e.g. "India"
  countryCode?: string;  // ISO code for the checkout form, e.g. "IN"
  pincode?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  addresses: SavedAddress[];
}

/** Client-side: read the logged-in user's profile via the storefront API. */
export async function fetchUserProfile(email: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`/api/profile?email=${encodeURIComponent(email)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export type ProfileAction =
  | { action: 'update'; email: string; name?: string; phone?: string; otp?: string; token?: string }
  | { action: 'change-email'; email: string; newEmail: string; otp: string; token: string }
  | { action: 'add-address'; email: string; address: SavedAddress }
  | { action: 'delete-address'; email: string; addressId: string }
  | { action: 'set-default'; email: string; addressId: string };

/** Client-side: mutate the profile. Returns the fresh profile on success. */
export async function postProfileAction(payload: ProfileAction): Promise<{ ok: boolean; error?: string; profile?: UserProfile }> {
  try {
    const res  = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: (data as { error?: string }).error || 'Something went wrong. Please try again.' };
    return { ok: true, profile: data as UserProfile };
  } catch {
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }
}

export interface AdminOrderPayload {
  no: string;
  customer: string;
  email: string;
  items: number;
  total: string;
  totalNum: number;
  payment: string;
  status: string;
  date: string;
  isoDate?: string;
  address: string;
  /** Structured delivery address — saved into the customer's address book by the admin. */
  addressObj?: SavedAddress;
  lines: { name: string; meta: string; qty: number; priceStr: string }[];
  subtotalStr: string;
  discountStr: string;
  shippingStr: string;
  promoCode?: string;
  promoDiscount?: number;
  subtotalNum?: number;
}

export interface PromoValidation {
  valid: boolean;
  code?: string;
  discount?: number;
  message?: string;
  error?: string;
}

export async function validatePromo(code: string, orderTotal: number): Promise<PromoValidation> {
  try {
    const res = await fetch(`${BASE}/api/promos/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, orderTotal }),
    });
    if (!res.ok) return { valid: false, error: 'Could not validate promo code. Please try again.' };
    return await res.json();
  } catch {
    return { valid: false, error: 'Could not validate promo code. Please try again.' };
  }
}

export async function fetchAdminOrders(): Promise<AdminOrderPayload[]> {
  try {
    const res = await fetch(`${BASE}/api/orders`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function createAdminOrder(payload: AdminOrderPayload): Promise<{ ok: boolean; promoError?: string }> {
  try {
    const res = await fetch(`${BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.status === 400 && payload.promoCode) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, promoError: (data as { error?: string }).error || 'This promo code is no longer valid.' };
    }
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
