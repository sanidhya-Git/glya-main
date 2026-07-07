'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';

export default function BannerCarousel() {
  const banners = useStore(s => s.adminBanners);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setIdx(i => (i + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const safeIdx = idx % banners.length;

  const slide = (b: (typeof banners)[number], i: number) => {
    const inner = (
      <div style={{ position:'absolute', inset:0, opacity: i === safeIdx ? 1 : 0, transition:'opacity .7s ease', pointerEvents: i === safeIdx ? 'auto' : 'none' }}>
        <Image src={b.imageUrl} alt={b.title || 'GLYA banner'} fill priority={i === 0} sizes="(max-width:1180px) 100vw, 1180px" style={{ objectFit:'cover' }} />
        {b.title && (
          <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'clamp(18px,3vw,32px) clamp(18px,3vw,36px)', background:'linear-gradient(transparent, rgba(33,28,23,0.72))' }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(20px,2.8vw,34px)', color:'#EDE6D8', lineHeight:1.15 }}>{b.title}</span>
          </div>
        )}
      </div>
    );
    if (!b.link) return <div key={b._id}>{inner}</div>;
    return b.link.startsWith('/')
      ? <Link key={b._id} href={b.link} aria-label={b.title || 'View collection'}>{inner}</Link>
      : <a key={b._id} href={b.link} aria-label={b.title || 'View collection'}>{inner}</a>;
  };

  return (
    <section style={{ maxWidth:1180, margin:'clamp(32px,5vw,56px) auto 0', padding:'0 clamp(16px,3vw,24px)' }}>
      <div style={{ position:'relative', width:'100%', aspectRatio:'21/9', minHeight:180, borderRadius:4, overflow:'hidden', border:'1px solid var(--line)', background:'var(--paper2)' }}>
        {banners.map(slide)}
        {banners.length > 1 && (
          <div style={{ position:'absolute', bottom:12, left:'50%', transform:'translateX(-50%)', display:'flex', gap:8, zIndex:2 }}>
            {banners.map((b, i) => (
              <button key={b._id} onClick={() => setIdx(i)} aria-label={`Banner ${i + 1}`}
                style={{ width:i === safeIdx ? 22 : 8, height:8, borderRadius:4, border:'none', cursor:'pointer', padding:0, background:i === safeIdx ? 'var(--gold)' : 'rgba(237,230,216,0.55)', transition:'all .3s' }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
