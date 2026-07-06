import type { Product } from './catalog';

const BASE = process.env.NEXT_PUBLIC_ADMIN_API ?? 'http://localhost:3001';

interface AdminProductRaw {
  sku: string;
  name: string;
  cat: string;
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
}

export type StorefrontProduct = Product & { images?: string[]; stock?: number };

function parseMetal(metal: string): { metal: string; karat: string } {
  const m = metal.trim();
  if (m === 'PT950' || m.toLowerCase().startsWith('platinum')) return { metal: 'Platinum', karat: 'PT950' };
  if (m === '18K' || m.includes('18')) return { metal: 'Gold', karat: '18K' };
  if (m === '22K' || m.includes('22')) return { metal: 'Gold', karat: '22K' };
  if (m.toLowerCase().includes('silver')) return { metal: 'Silver', karat: '925' };
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
  return {
    id: skuToId(p.sku),
    name: p.name || '',
    cat: p.cat || '',
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

export async function fetchAdminPricing(): Promise<{ goldRate24k: number } | null> {
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
    const res = await fetch(`${BASE}/api/journal`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data: AdminPost[] = await res.json();
    return data.filter(p => p.status === 'Published');
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
  address: string;
  lines: { name: string; meta: string; qty: number; priceStr: string }[];
  subtotalStr: string;
  discountStr: string;
  shippingStr: string;
}

export async function createAdminOrder(payload: AdminOrderPayload): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
