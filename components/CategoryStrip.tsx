'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import type { AdminFeaturedCategory } from '@/lib/api';

const SPEED_PX_S = 34; // marquee speed

/* Round "shop by category" tiles below the hero banner (admin: Shop by category).
   Continuous marquee: tiles are duplicated and scrolled seamlessly via rAF,
   pausing while the user hovers, touches, or drags the strip. */
export default function CategoryStrip() {
  const featuredCats = useStore(s => s.featuredCats);
  const cats = useMemo(
    () => [...featuredCats].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [featuredCats]
  );

  const marquee = cats.length >= 3;
  const [copies, setCopies] = useState(2);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ensure the duplicated row is at least 2× the viewport so the loop is seamless
  useEffect(() => {
    if (!marquee) return;
    const scroller = scrollRef.current;
    if (!scroller) return;
    const measure = () => {
      const single = scroller.scrollWidth / copies;
      if (single > 0 && single < scroller.clientWidth) {
        const need = Math.max(2, Math.ceil((scroller.clientWidth * 2) / single));
        if (need > copies) setCopies(need);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(scroller);
    return () => ro.disconnect();
  }, [marquee, copies, cats.length]);

  // Seamless auto-scroll loop
  useEffect(() => {
    if (!marquee) return;
    const scroller = scrollRef.current;
    if (!scroller) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      if (!pausedRef.current) {
        // Accumulate sub-pixel movement so slow speeds still advance
        acc += (SPEED_PX_S * dt) / 1000;
        if (acc >= 1) {
          const step = Math.floor(acc);
          acc -= step;
          const half = scroller.scrollWidth / 2;
          let next = scroller.scrollLeft + step;
          if (half > 0 && next >= half) next -= half;
          scroller.scrollLeft = next;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [marquee, cats.length, copies]);

  const pause = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    pausedRef.current = true;
  };
  const resumeSoon = (delay = 1200) => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => { pausedRef.current = false; }, delay);
  };
  useEffect(() => () => { if (resumeTimer.current) clearTimeout(resumeTimer.current); }, []);

  if (cats.length === 0) return null;

  const tile = (c: AdminFeaturedCategory, key: string) => {
    const label = c.name || c.category || '';
    // Custom link wins; otherwise the category routes to that category's products
    const href = c.link || (c.category ? `/browse?cat=${encodeURIComponent(c.category)}` : '');
    const inner = (
      <>
        <span className="cat-strip-img" style={{ position:'relative', width:'clamp(88px,13vw,150px)', height:'clamp(88px,13vw,150px)', borderRadius:'50%', overflow:'hidden', display:'block', border:'1px solid var(--line)', background:'var(--paper2)' }}>
          <Image src={c.imageUrl} alt={label || 'Category'} fill sizes="(max-width:880px) 30vw, 150px" style={{ objectFit:'cover' }} draggable={false} />
        </span>
        {label && (
          <span style={{ fontSize:'clamp(11px,1.3vw,12.5px)', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:500, color:'var(--ink)', textAlign:'center', lineHeight:1.35, maxWidth:'clamp(96px,14vw,160px)', transition:'color .3s ease' }}>
            {label}
          </span>
        )}
      </>
    );
    const tileStyle: React.CSSProperties = { display:'flex', flexDirection:'column', alignItems:'center', gap:12, textDecoration:'none', flexShrink:0 };
    if (!href) return <div key={key} className="cat-strip-tile" style={tileStyle}>{inner}</div>;
    return href.startsWith('/')
      ? <Link key={key} href={href} aria-label={`Shop ${label || 'category'}`} className="cat-strip-tile" draggable={false} style={tileStyle}>{inner}</Link>
      : <a key={key} href={href} aria-label={`Shop ${label || 'category'}`} className="cat-strip-tile" draggable={false} style={tileStyle}>{inner}</a>;
  };

  const rows = marquee
    ? Array.from({ length: copies }, (_, ci) => cats.map(c => tile(c, `${c._id}-${ci}`))).flat()
    : cats.map(c => tile(c, c._id));

  return (
    <section aria-label="Shop by category" style={{ padding:'clamp(28px,4vw,44px) 0 0' }}>
      <style>{`
        .cat-strip-scroll { overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
        .cat-strip-scroll::-webkit-scrollbar { display:none; }
        /* Vertical padding gives the hover ring + pop scale room; overflow-x clips overflow-y too */
        .cat-strip-row { display:flex; align-items:flex-start; gap:clamp(18px,3.5vw,44px); width:max-content; margin:0 auto; padding:16px clamp(24px,4vw,48px) 14px; }
        .cat-strip-tile .cat-strip-img { transition:box-shadow .3s ease, transform .3s ease; }
        .cat-strip-tile:hover .cat-strip-img { box-shadow:0 0 0 2px var(--gold), 0 10px 24px rgba(43,37,31,.14); transform:translateY(-6px) scale(1.08); }
        .cat-strip-tile:hover span:last-child { color:var(--gold-d); }
      `}</style>
      <div
        ref={scrollRef}
        className="cat-strip-scroll"
        onMouseEnter={pause}
        onMouseLeave={() => resumeSoon(300)}
        onTouchStart={pause}
        onTouchEnd={() => resumeSoon()}
        onTouchCancel={() => resumeSoon()}
      >
        <div className="cat-strip-row">
          {rows}
        </div>
      </div>
    </section>
  );
}
