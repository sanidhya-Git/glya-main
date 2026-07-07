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
  return 0.95; // PT950
}

export function priceOf(p: Product, karat?: string, goldRate = 7180) {
  const k = karat || p.karat;
  const metalRate = p.metal === 'Platinum' ? 3380 : goldRate;
  const mv = Math.round(p.weightG * metalRate * karatFactor(k));
  const mk = Math.round(mv * p.makingPct);
  const gem = p.gemValue || 0;
  const sub = mv + mk + gem;
  const gst = Math.round(sub * 0.03);
  return { mv, mk, gem, gst, sub, total: sub + gst };
}

export function metalLabel(p: Product) {
  return p.metal === 'Platinum' ? 'Platinum 950' : `${p.karat} Yellow Gold`;
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
