'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import type { AdminBanner } from '@/lib/api';

const ROTATE_MS = 5000;

function StaticHero() {
  return (
    <section style={{ height:'90vh', minHeight:500, background:'#211C17', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 clamp(20px,5vw,60px)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 60% 40%, rgba(176,141,87,0.18) 0%, transparent 62%)', pointerEvents:'none' }} />
      <p style={{ fontSize:11, letterSpacing:'0.22em', textTransform:'uppercase', color:'#B08D57', position:'relative' }}>Fine jewellery · since 2019</p>
      <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(44px,8vw,100px)', color:'#EDE6D8', lineHeight:1.0, marginTop:18, maxWidth:800, fontWeight:400, position:'relative' }}>
        Where gold<br />meets <em style={{ fontStyle:'italic', color:'#B08D57' }}>art</em>
      </h1>
      <p style={{ color:'#9E958A', fontSize:'clamp(14px,1.5vw,16px)', marginTop:22, maxWidth:420, lineHeight:1.7, position:'relative' }}>
        Each piece designed in our Pune atelier. Hallmarked, certified, and made to become your heirloom.
      </p>
      <div style={{ display:'flex', gap:14, marginTop:36, flexWrap:'wrap', justifyContent:'center', position:'relative' }}>
        <Link href="/browse" style={{ display:'inline-block', padding:'14px 36px', background:'#B08D57', color:'#211C17', fontSize:12.5, letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:600, textDecoration:'none', borderRadius:2 }}>Shop the collection</Link>
        <Link href="/browse?col=Bridal" style={{ display:'inline-block', padding:'14px 36px', border:'1px solid rgba(237,230,216,0.28)', color:'#EDE6D8', fontSize:12.5, letterSpacing:'0.12em', textTransform:'uppercase', textDecoration:'none', borderRadius:2 }}>Bridal edit</Link>
      </div>
    </section>
  );
}

export default function HeroCarousel() {
  const adminBanners = useStore(s => s.adminBanners);
  const banners = useMemo(
    () => [...adminBanners].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [adminBanners]
  );
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (banners.length < 2 || paused) return;
    const t = setInterval(() => setIdx(i => (i + 1) % banners.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [banners.length, paused]);

  if (banners.length === 0) return <StaticHero />;

  const safeIdx = idx % banners.length;
  const prev = () => setIdx(i => (i - 1 + banners.length) % banners.length);
  const next = () => setIdx(i => (i + 1) % banners.length);

  const slide = (b: AdminBanner, i: number) => {
    const img = (
      <Image src={b.imageUrl} alt={b.title || 'GLYA banner'} fill priority={i === 0} sizes="100vw" style={{ objectFit:'cover' }} />
    );
    // Custom link wins; otherwise a category routes to that category's products
    const href = b.link || (b.category ? `/browse?cat=${encodeURIComponent(b.category)}` : '');
    const slideStyle: React.CSSProperties = { position:'relative', width:'100%', flexShrink:0, height:'100%' };
    if (!href) return <div key={b._id} style={slideStyle}>{img}</div>;
    return href.startsWith('/')
      ? <Link key={b._id} href={href} aria-label={b.category ? `Shop ${b.category}` : 'View collection'} draggable={false} style={{ ...slideStyle, display:'block' }}>{img}</Link>
      : <a key={b._id} href={href} aria-label="View collection" draggable={false} style={{ ...slideStyle, display:'block' }}>{img}</a>;
  };

  const arrowStyle: React.CSSProperties = {
    position:'absolute', top:'50%', transform:'translateY(-50%)', zIndex:2,
    width:40, height:40, borderRadius:'50%', border:'none',
    background:'rgba(255,255,255,0.85)', color:'#211C17', fontSize:20, lineHeight:1,
    display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
    boxShadow:'0 2px 10px rgba(0,0,0,0.18)',
  };

  return (
    <section aria-label="Featured collections">
      <div
        style={{ position:'relative', overflow:'hidden', background:'#211C17', height:'clamp(300px, 38vw, 640px)' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={e => { touchX.current = e.touches[0].clientX; setPaused(true); }}
        onTouchEnd={e => {
          const start = touchX.current;
          touchX.current = null;
          setPaused(false);
          if (start === null) return;
          const dx = e.changedTouches[0].clientX - start;
          if (Math.abs(dx) > 48) (dx < 0 ? next : prev)();
        }}
      >
        <div style={{ display:'flex', height:'100%', transform:`translateX(-${safeIdx * 100}%)`, transition:'transform .65s cubic-bezier(.4,0,.2,1)' }}>
          {banners.map(slide)}
        </div>
        {banners.length > 1 && (
          <>
            <button aria-label="Previous banner" onClick={prev} style={{ ...arrowStyle, left:'clamp(10px,2vw,24px)' }}>‹</button>
            <button aria-label="Next banner" onClick={next} style={{ ...arrowStyle, right:'clamp(10px,2vw,24px)' }}>›</button>
          </>
        )}
      </div>
      {banners.length > 1 && (
        banners.length <= 10 ? (
          <div style={{ display:'flex', justifyContent:'center', gap:9, padding:'14px 0 2px' }}>
            {banners.map((b, i) => (
              <button key={b._id} onClick={() => setIdx(i)} aria-label={`Banner ${i + 1}`}
                style={{ width:i === safeIdx ? 20 : 7, height:7, borderRadius:4, border:'none', cursor:'pointer', padding:0, background:i === safeIdx ? 'var(--gold)' : 'rgba(33,28,23,0.25)', transition:'all .3s' }} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'12px 0 2px', fontSize:12, letterSpacing:'0.14em', color:'var(--muted)' }}>
            {safeIdx + 1} / {banners.length}
          </div>
        )
      )}
    </section>
  );
}
