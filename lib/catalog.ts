export interface Product {
  id: number;
  name: string;
  cat: string;
  col: string;
  metal: string;
  karat: string;
  gem: string;
  gemValue: number;
  weightG: number;
  makingPct: number;
  tag: string;
  rating: number;
  reviews: number;
  blurb: string;
}

export function karatFactor(k: string) {
  if (k === '22K') return 0.916;
  if (k === '18K') return 0.75;
  if (k === '925') return 0.925;
  return 0.95; // PT950
}

export interface MetalRates { gold: number; silver: number; platinum: number }

/* Third arg accepts either the full rates object (preferred) or a bare gold
   rate number for older call sites. */
export function priceOf(p: Product, karat?: string, rates: number | Partial<MetalRates> = {}) {
  const r = typeof rates === 'number' ? { gold: rates } : rates;
  const gold = r.gold ?? 7180, silver = r.silver ?? 94, platinum = r.platinum ?? 3380;
  const k = karat || p.karat;
  // Diamond pieces carry no metal-weight value — the stone (gemValue) is the price.
  const metalRate = p.metal === 'Platinum' ? platinum : p.metal === 'Silver' ? silver : p.metal === 'Diamond' ? 0 : gold;
  const mv = Math.round(p.weightG * metalRate * karatFactor(k));
  const mk = Math.round(mv * p.makingPct);
  const gem = p.gemValue || 0;
  const sub = mv + mk + gem;
  const gst = Math.round(sub * 0.03);
  return { mv, mk, gem, gst, sub, total: sub + gst };
}

export function karatLabel(k: string) {
  if (k === 'PT950') return 'Platinum 950';
  if (k === '925') return '925 Sterling Silver';
  if (k === 'DIA-LAB') return 'Lab-grown Diamond';
  if (k === 'DIA') return 'Natural Diamond';
  return `${k} Yellow Gold`;
}

export function metalLabel(p: Product) {
  return karatLabel(p.karat);
}

export function inr(n: number) {
  n = Math.round(n);
  const neg = n < 0;
  n = Math.abs(n);
  const s = String(n);
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const g = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' : '';
  return (neg ? '−' : '') + '₹' + g + last3;
}

export function sizeInfo(p: Product) {
  switch (p.cat) {
    case 'Rings': return { label: 'Ring size (Indian)', opts: ['6','8','10','12','14','16','18','20'] };
    case 'Bangles': return { label: 'Bangle size (inch)', opts: ['2.2','2.4','2.6','2.8'] };
    case 'Necklaces': return { label: 'Chain length', opts: ['16"','18"','20"','22"'] };
    case 'Bracelets': return { label: 'Length', opts: ['6.5"','7"','7.5"'] };
    default: return null;
  }
}
