'use client';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { catalog, priceOf, inr } from '@/lib/catalog';
import GoldRateProvider from '@/components/GoldRateProvider';
import PromoBar from '@/components/PromoBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const CATS = [
  { name: 'Rings',        icon: '◉', href: '/browse?cat=Rings' },
  { name: 'Necklaces',    icon: '◈', href: '/browse?cat=Necklaces' },
  { name: 'Bangles',      icon: '○', href: '/browse?cat=Bangles' },
  { name: 'Earrings',     icon: '◎', href: '/browse?cat=Earrings' },
  { name: 'Bridal',       icon: '✦', href: '/browse?col=Bridal' },
  { name: 'New arrivals', icon: '▲', href: '/browse?tag=New' },
];

const PLATINUM_RATE = 3380;

export default function Home() {
  const goldRate = useStore(s => s.goldRate);
  const trending = catalog.filter(p => p.tag === 'Bestseller' || p.tag === 'Trending').slice(0, 8);
  const newArr   = catalog.filter(p => p.tag === 'New').slice(0, 4);
  const r22      = Math.round(goldRate * 0.916);
  const r18      = Math.round(goldRate * 0.75);

  return (
    <>
      <style>{`
        .home-editorial { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); border:1px solid var(--line); overflow:hidden; }
        .home-editorial-img { background:#2F4A3F; min-height:320px; display:flex; align-items:center; justify-content:center; }
        .home-editorial-text { padding:clamp(28px,5vw,56px) clamp(22px,4vw,48px); display:flex; flex-direction:column; justify-content:center; }
        .home-price-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; }
      `}</style>
      <GoldRateProvider />
      <PromoBar />
      <Header />

      <main style={{ background:'var(--paper)', minHeight:'calc(100vh - 120px)' }}>

        {/* ── HERO ── */}
        <section style={{ height:'88vh', minHeight:480, background:'#211C17', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 24px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 60% 40%, rgba(176,141,87,0.18) 0%, transparent 62%)', pointerEvents:'none' }} />
          <p style={{ fontSize:11, letterSpacing:'0.22em', textTransform:'uppercase', color:'#B08D57', position:'relative' }}>Fine jewellery · since 2019</p>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(40px,7vw,96px)', color:'#EDE6D8', lineHeight:1.0, marginTop:18, maxWidth:800, fontWeight:400, position:'relative' }}>
            Where gold<br />meets <em style={{ fontStyle:'italic', color:'#B08D57' }}>art</em>
          </h1>
          <p style={{ color:'#9E958A', fontSize:15, marginTop:22, maxWidth:420, lineHeight:1.7, position:'relative' }}>
            Each piece designed in our Pune atelier. Hallmarked, certified, and made to become your heirloom.
          </p>
          <div style={{ display:'flex', gap:14, marginTop:34, flexWrap:'wrap', justifyContent:'center', position:'relative' }}>
            <Link href="/browse" style={{ display:'inline-block', padding:'13px 32px', background:'#B08D57', color:'#211C17', fontSize:13, letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:600, textDecoration:'none' }}>Shop the collection</Link>
            <Link href="/browse?col=Bridal" style={{ display:'inline-block', padding:'13px 32px', border:'1px solid rgba(237,230,216,0.28)', color:'#EDE6D8', fontSize:13, letterSpacing:'0.1em', textTransform:'uppercase', textDecoration:'none' }}>Bridal edit</Link>
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section style={{ maxWidth:1180, margin:'0 auto', padding:'clamp(44px,6vw,72px) clamp(16px,3vw,24px) 0' }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <p style={{ fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)' }}>Shop by category</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(26px,3.5vw,44px)', fontWeight:400, marginTop:8 }}>Find your piece</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:12 }}>
            {CATS.map(c => (
              <Link key={c.name} href={c.href} style={{ textDecoration:'none', display:'flex', flexDirection:'column', alignItems:'center', gap:12, padding:'26px 12px', border:'1px solid var(--line)', background:'#fff', borderRadius:2, color:'var(--ink)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor='var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor='var(--line)')}
              >
                <span style={{ fontSize:26, color:'var(--gold)' }}>{c.icon}</span>
                <span style={{ fontSize:11.5, letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:500, textAlign:'center' }}>{c.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── EDITORIAL SPLIT ── */}
        <section style={{ maxWidth:1180, margin:'clamp(44px,6vw,72px) auto 0', padding:'0 clamp(16px,3vw,24px)' }}>
          <div className="home-editorial">
            <div className="home-editorial-img">
              <span style={{ fontSize:80, color:'rgba(237,230,216,0.12)' }}>◈</span>
            </div>
            <div className="home-editorial-text">
              <p style={{ fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)' }}>The bridal edit</p>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,3vw,40px)', fontWeight:400, marginTop:12, lineHeight:1.2 }}>
                For the most important chapter of your story
              </h2>
              <p style={{ color:'var(--ink2)', lineHeight:1.8, marginTop:16, fontSize:15 }}>
                From engagement rings to trousseau sets — every piece crafted in our atelier, certified, and delivered with the GLYA guarantee.
              </p>
              <Link href="/browse?col=Bridal" style={{ display:'inline-block', marginTop:28, padding:'12px 28px', border:'1px solid var(--ink)', fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', textDecoration:'none', color:'var(--ink)', alignSelf:'flex-start' }}>
                Explore bridal →
              </Link>
            </div>
          </div>
        </section>

        {/* ── TRENDING ── */}
        <section style={{ maxWidth:1180, margin:'clamp(44px,6vw,72px) auto 0', padding:'0 clamp(16px,3vw,24px)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28, flexWrap:'wrap', gap:12 }}>
            <div>
              <p style={{ fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)' }}>Right now</p>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,3vw,40px)', fontWeight:400, marginTop:4 }}>Trending pieces</h2>
            </div>
            <Link href="/browse" style={{ fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gold)', textDecoration:'none' }}>View all →</Link>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'clamp(12px,2vw,22px)' }}>
            {trending.map(p => <ProductCard key={p.id} product={p} goldRate={goldRate} />)}
          </div>
        </section>

        {/* ── LIVE PRICING BAND ── */}
        <section style={{ background:'var(--paper2)', margin:'clamp(44px,6vw,72px) 0 0', padding:'clamp(32px,5vw,56px) clamp(16px,3vw,24px)' }}>
          <div style={{ maxWidth:1180, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:36 }}>
              <p style={{ fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)' }}>Live pricing</p>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,3vw,40px)', fontWeight:400, marginTop:8 }}>Price moves with the market</h2>
              <p style={{ color:'var(--ink2)', marginTop:8, fontSize:14 }}>All prices update in real-time as gold rates change.</p>
            </div>
            <div className="home-price-grid">
              {[
                { label:"22K Gold · today's rate",      val: inr(r22),              sub:'per gram · BIS hallmarked' },
                { label:"18K Gold · today's rate",      val: inr(r18),              sub:'per gram · hallmarked' },
                { label:"Platinum 950 · today's rate",  val: inr(PLATINUM_RATE),    sub:'per gram · hallmarked' },
              ].map(card => (
                <div key={card.label} style={{ border:'1px solid var(--line)', background:'#fff', padding:'clamp(18px,3vw,26px) clamp(16px,3vw,24px)', textAlign:'center' }}>
                  <p style={{ fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)' }}>{card.label}</p>
                  <p className="flash" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(28px,3vw,38px)', fontWeight:500, color:'var(--gold)', margin:'8px 0 4px' }}>{card.val}</p>
                  <p style={{ fontSize:12, color:'var(--muted)' }}>{card.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NEW ARRIVALS ── */}
        <section style={{ maxWidth:1180, margin:'0 auto', padding:'clamp(44px,6vw,72px) clamp(16px,3vw,24px) clamp(60px,6vw,80px)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28, flexWrap:'wrap', gap:12 }}>
            <div>
              <p style={{ fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)' }}>Just arrived</p>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,3vw,40px)', fontWeight:400, marginTop:4 }}>New arrivals</h2>
            </div>
            <Link href="/browse?tag=New" style={{ fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gold)', textDecoration:'none' }}>See new →</Link>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'clamp(12px,2vw,22px)' }}>
            {newArr.map(p => <ProductCard key={p.id} product={p} goldRate={goldRate} />)}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
