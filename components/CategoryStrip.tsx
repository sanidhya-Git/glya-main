'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import type { AdminFeaturedCategory } from '@/lib/api';

/* Round "shop by category" tiles below the hero banner (admin: Shop by category).
   Centered row on desktop; swipes horizontally on mobile when tiles overflow. */
export default function CategoryStrip() {
  const featuredCats = useStore(s => s.featuredCats);
  const cats = useMemo(
    () => [...featuredCats].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [featuredCats]
  );

  if (cats.length === 0) return null;

  const tile = (c: AdminFeaturedCategory) => {
    const label = c.name || c.category || '';
    // Custom link wins; otherwise the category routes to that category's products
    const href = c.link || (c.category ? `/browse?cat=${encodeURIComponent(c.category)}` : '');
    const inner = (
      <>
        <span className="cat-strip-img" style={{ position:'relative', width:'clamp(88px,13vw,150px)', height:'clamp(88px,13vw,150px)', borderRadius:'50%', overflow:'hidden', display:'block', border:'1px solid var(--line)', background:'var(--paper2)' }}>
          <Image src={c.imageUrl} alt={label || 'Category'} fill sizes="(max-width:880px) 30vw, 150px" style={{ objectFit:'cover' }} draggable={false} />
        </span>
        {label && (
          <span style={{ fontSize:'clamp(11px,1.3vw,12.5px)', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:500, color:'var(--ink)', textAlign:'center', lineHeight:1.35, maxWidth:'clamp(96px,14vw,160px)' }}>
            {label}
          </span>
        )}
      </>
    );
    const tileStyle: React.CSSProperties = { display:'flex', flexDirection:'column', alignItems:'center', gap:12, textDecoration:'none', flexShrink:0 };
    if (!href) return <div key={c._id} style={tileStyle}>{inner}</div>;
    return href.startsWith('/')
      ? <Link key={c._id} href={href} aria-label={`Shop ${label || 'category'}`} className="cat-strip-tile" draggable={false} style={tileStyle}>{inner}</Link>
      : <a key={c._id} href={href} aria-label={`Shop ${label || 'category'}`} className="cat-strip-tile" draggable={false} style={tileStyle}>{inner}</a>;
  };

  return (
    <section aria-label="Shop by category" style={{ padding:'clamp(28px,4vw,44px) 0 0' }}>
      <style>{`
        .cat-strip-scroll { overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
        .cat-strip-scroll::-webkit-scrollbar { display:none; }
        /* width:max-content + margin:auto — centers when tiles fit, scrolls when they don't */
        .cat-strip-row { display:flex; gap:clamp(18px,3.5vw,44px); width:max-content; margin:0 auto; padding:0 clamp(16px,3vw,24px); }
        .cat-strip-tile .cat-strip-img { transition:box-shadow .25s ease, transform .25s ease; }
        .cat-strip-tile:hover .cat-strip-img { box-shadow:0 0 0 2px var(--gold); transform:scale(1.03); }
      `}</style>
      <div className="cat-strip-scroll">
        <div className="cat-strip-row">
          {cats.map(tile)}
        </div>
      </div>
    </section>
  );
}
