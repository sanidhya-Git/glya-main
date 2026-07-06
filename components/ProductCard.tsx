'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { Product, priceOf, inr, metalLabel } from '@/lib/catalog';
import type { StorefrontProduct } from '@/lib/api';

interface Props {
  product: Product;
  goldRate: number;
  size?: 'sm' | 'md';
}

export default function ProductCard({ product: p, goldRate, size = 'md' }: Props) {
  const wishlist   = useStore(s => s.wishlist);
  const toggleWish = useStore(s => s.toggleWish);
  const wished     = wishlist.includes(p.id);
  const pr         = priceOf(p, undefined, goldRate);
  const img        = (p as StorefrontProduct).images?.[0];

  return (
    <div style={{ cursor:'pointer', position:'relative' }}>
      <div style={{ position:'relative' }}>
        <Link href={`/product/${p.id}`} style={{ display:'block', textDecoration:'none' }}>
          <div style={{
            width:'100%', aspectRatio: size === 'sm' ? '1/1' : '4/5',
            background:'var(--paper2)', borderRadius:3, overflow:'hidden',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:32, color:'var(--line)', border:'1px solid var(--line)',
            position:'relative'
          }}>
            {img
              ? <Image src={img} alt={p.name} fill sizes="(max-width:600px) 50vw,25vw" style={{ objectFit:'cover' }} />
              : <span>◈</span>
            }
          </div>
        </Link>
        {p.tag && (
          <span style={{ position:'absolute', top:12, left:12, background:'rgba(250,247,241,0.94)', fontSize:10.5, letterSpacing:'0.12em', textTransform:'uppercase', padding:'5px 10px', borderRadius:2, color:'var(--gold-d)', zIndex:1 }}>{p.tag}</span>
        )}
        <button
          onClick={e => { e.preventDefault(); toggleWish(p.id); }}
          style={{ position:'absolute', top:10, right:10, width:34, height:34, borderRadius:'50%', border:'none', background:'rgba(250,247,241,0.9)', cursor:'pointer', fontSize:16, color:wished?'#B08D57':'#211C17', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1, transition:'color .18s, transform .15s' }}
        >
          {wished ? '♥' : '♡'}
        </button>
      </div>
      <Link href={`/product/${p.id}`} style={{ textDecoration:'none', color:'inherit' }}>
        <div style={{ marginTop:14 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: size === 'sm' ? 17 : 20, lineHeight:1.15 }}>{p.name}</div>
          <div style={{ fontSize:12, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--muted)', margin:'5px 0 8px' }}>{metalLabel(p)}</div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize: size === 'sm' ? 14 : 16, fontWeight:500 }}>{inr(pr.total)}</span>
            {p.rating > 0 && <span style={{ fontSize:12, color:'var(--muted)' }}>★ {p.rating.toFixed(1)}</span>}
          </div>
        </div>
      </Link>
    </div>
  );
}
