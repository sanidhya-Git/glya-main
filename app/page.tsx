'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import GoldRateProvider from '@/components/GoldRateProvider';
import DataProvider from '@/components/DataProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';
import CategoryStrip from '@/components/CategoryStrip';
import SiteLoader from '@/components/SiteLoader';
import Reveal from '@/components/Reveal';
import type { StorefrontProduct } from '@/lib/api';

function MetalRow({ eyebrow, title, href, linkLabel, items }: {
  eyebrow: string; title: string; href: string; linkLabel: string; items: StorefrontProduct[];
}) {
  if (items.length === 0) return null;
  return (
    <section style={{ maxWidth:1180, margin:'clamp(44px,6vw,72px) auto 0', padding:'0 clamp(16px,3vw,24px)' }}>
      <Reveal>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28, flexWrap:'wrap', gap:12 }}>
          <div>
            <p style={{ fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)' }}>{eyebrow}</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,3vw,40px)', fontWeight:400, marginTop:4 }}>{title}</h2>
          </div>
          <Link href={href} style={{ fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gold-d)', textDecoration:'none' }}>{linkLabel} →</Link>
        </div>
      </Reveal>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(clamp(150px,20vw,220px),1fr))', gap:'clamp(12px,2vw,22px)' }}>
        {items.map((p, i) => <Reveal key={p.id} delay={Math.min(i, 3) * 90}><ProductCard product={p} /></Reveal>)}
      </div>
    </section>
  );
}

export default function Home() {
  const adminProducts   = useStore(s => s.adminProducts);
  const productsLoaded  = useStore(s => s.productsLoaded);
  const adminJournal    = useStore(s => s.adminJournal);

  const products = adminProducts;
  const tagged   = products.filter(p => p.tag === 'Bestseller' || p.tag === 'Trending').slice(0, 8);
  const trending = tagged.length > 0 ? tagged : products.slice(0, 8);
  const newArr   = products.filter(p => p.tag === 'New').slice(0, 4);

  /* Metal rows — prefer pieces not already shown in Trending so the page
     doesn't repeat the same products back to back. */
  const shown = new Set(trending.map(p => p.id));
  const pickRow = (filter: (p: StorefrontProduct) => boolean) => {
    const all   = products.filter(filter);
    const fresh = all.filter(p => !shown.has(p.id));
    const row   = [...fresh, ...all.filter(p => shown.has(p.id))].slice(0, 4);
    row.forEach(p => shown.add(p.id));
    return row;
  };
  const goldRow    = pickRow(p => p.metal === 'Gold');
  const silverRow  = pickRow(p => p.metal === 'Silver');
  const diamondRow = pickRow(p => p.metal === 'Diamond' || p.gemValue > 0);

  const blogs = adminJournal.filter(p => p.status === 'Published').slice(0, 3);

  return (
    <>
      <SiteLoader />
      <style>{`
        .home-editorial { display:grid; grid-template-columns:1fr 1fr; border:1px solid var(--line); overflow:hidden; border-radius:4px; }
        .home-editorial-img { background:#2F4A3F; min-height:340px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
        .home-editorial-text { padding:clamp(28px,5vw,56px) clamp(22px,4vw,48px); display:flex; flex-direction:column; justify-content:center; }
        .trust-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:0; border:1px solid rgba(237,230,216,0.18); }
        .trust-item { padding:clamp(16px,2.5vw,28px) clamp(12px,2vw,22px); text-align:center; border-right:1px solid rgba(237,230,216,0.18); }
        .trust-item:last-child { border-right:none; }
        .blog-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(16px,2.5vw,32px); }
        .blog-card .blog-img { transition:transform 1s cubic-bezier(.22,.61,.21,1); }
        .blog-card:hover .blog-img { transform:scale(1.05); }
        .blog-card .blog-title { transition:color .25s ease; }
        .blog-card:hover .blog-title { color:var(--gold-d); }
        .blog-card .blog-arrow { display:inline-block; transition:transform .25s ease; }
        .blog-card:hover .blog-arrow { transform:translateX(6px); }
        .home-skel {
          background:linear-gradient(100deg, var(--paper2) 30%, #F3EDE1 50%, var(--paper2) 70%);
          background-size:200% 100%;
          animation:homeShimmer 1.8s ease-in-out infinite;
          border:1px solid var(--line); border-radius:3px;
        }
        @keyframes homeShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @media(max-width:900px){
          .home-editorial { grid-template-columns:1fr; }
          .home-editorial-img { min-height:240px; }
          .trust-grid { grid-template-columns:repeat(2,1fr); }
          .trust-item:nth-child(2) { border-right:none; }
          .trust-item:nth-child(3) { border-top:1px solid rgba(237,230,216,0.18); }
          .trust-item:nth-child(4) { border-top:1px solid rgba(237,230,216,0.18); border-right:none; }
          .blog-grid { grid-template-columns:1fr; }
        }
        @media(max-width:600px){
          .trust-grid { grid-template-columns:1fr 1fr; }
        }
      `}</style>
      <GoldRateProvider />
      <DataProvider />
      <Header />

      <main style={{ background:'var(--paper)', minHeight:'calc(100vh - 120px)' }}>

        {/* ── HERO (admin banners carousel, static fallback) ── */}
        <HeroCarousel />

        {/* ── SHOP BY CATEGORY (admin round tiles, hidden when none) ── */}
        <CategoryStrip />

        {/* ── TRENDING ── */}
        {!productsLoaded ? (
          <section style={{ maxWidth:1180, margin:'clamp(44px,6vw,72px) auto 0', padding:'0 clamp(16px,3vw,24px)' }} aria-busy="true" aria-label="Loading pieces">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28, flexWrap:'wrap', gap:12 }}>
              <div>
                <p style={{ fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)' }}>Right now</p>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,3vw,40px)', fontWeight:400, marginTop:4, color:'var(--muted)' }}>Curating pieces…</h2>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(clamp(150px,20vw,220px),1fr))', gap:'clamp(12px,2vw,22px)' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="home-skel" style={{ width:'100%', aspectRatio:'4/5', borderRadius:14 }} />
                  <div className="home-skel" style={{ width:'70%', height:14, marginTop:12, border:'none' }} />
                  <div className="home-skel" style={{ width:'45%', height:12, marginTop:8, border:'none' }} />
                </div>
              ))}
            </div>
          </section>
        ) : trending.length > 0 ? (
          <section style={{ maxWidth:1180, margin:'clamp(44px,6vw,72px) auto 0', padding:'0 clamp(16px,3vw,24px)' }}>
            <Reveal>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28, flexWrap:'wrap', gap:12 }}>
                <div>
                  <p style={{ fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)' }}>Right now</p>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,3vw,40px)', fontWeight:400, marginTop:4 }}>Trending pieces</h2>
                </div>
                <Link href="/browse" style={{ fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gold-d)', textDecoration:'none' }}>View all →</Link>
              </div>
            </Reveal>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(clamp(150px,20vw,220px),1fr))', gap:'clamp(12px,2vw,22px)' }}>
              {trending.map((p, i) => <Reveal key={p.id} delay={Math.min(i, 3) * 90}><ProductCard product={p} /></Reveal>)}
            </div>
          </section>
        ) : (
          <section style={{ maxWidth:1180, margin:'clamp(44px,6vw,72px) auto 0', padding:'0 clamp(16px,3vw,24px)' }}>
            <div style={{ border:'1px solid var(--line)', borderRadius:4, background:'#fff', textAlign:'center', padding:'clamp(48px,7vw,84px) clamp(20px,4vw,40px)' }}>
              <div style={{ fontSize:34, color:'var(--gold-d)' }}>◈</div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(24px,3vw,38px)', fontWeight:400, marginTop:14 }}>Our collection is being curated</h2>
              <p style={{ color:'var(--muted)', fontSize:14.5, lineHeight:1.7, marginTop:10, maxWidth:420, marginLeft:'auto', marginRight:'auto' }}>
                New pieces from our Pune atelier will appear here very soon. In the meantime, we would love to hear from you.
              </p>
              <Link href="/contact" style={{ display:'inline-block', marginTop:26, padding:'12px 30px', border:'1px solid var(--ink)', fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', textDecoration:'none', color:'var(--ink)', borderRadius:2 }}>
                Get in touch →
              </Link>
            </div>
          </section>
        )}

        {/* ── SHOP BY METAL — gold / silver / diamond edits ── */}
        {productsLoaded && (
          <>
            <MetalRow eyebrow="The gold edit"    title="Crafted in gold"   href="/browse?metal=Gold"    linkLabel="All gold"     items={goldRow} />
            <MetalRow eyebrow="Sterling silver"  title="Everyday silver"   href="/browse?metal=Silver"  linkLabel="All silver"   items={silverRow} />
            <MetalRow eyebrow="Diamonds"         title="Set with diamonds" href="/browse?metal=Diamond" linkLabel="All diamonds" items={diamondRow} />
          </>
        )}

        {/* ── EDITORIAL SPLIT ── */}
        <section style={{ maxWidth:1180, margin:'clamp(44px,6vw,72px) auto 0', padding:'0 clamp(16px,3vw,24px)' }}>
          <Reveal>
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
              <Link href="/browse?col=Bridal"
                style={{ display:'inline-block', marginTop:28, padding:'12px 28px', border:'1px solid var(--ink)', fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', textDecoration:'none', color:'var(--ink)', alignSelf:'flex-start' }}>
                Explore bridal →
              </Link>
            </div>
          </div>
          </Reveal>
        </section>

        {/* ── NEW ARRIVALS ── */}
        {productsLoaded && newArr.length > 0 && (
          <section style={{ maxWidth:1180, margin:'clamp(44px,6vw,72px) auto 0', padding:'0 clamp(16px,3vw,24px)' }}>
            <Reveal>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28, flexWrap:'wrap', gap:12 }}>
                <div>
                  <p style={{ fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)' }}>Just arrived</p>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,3vw,40px)', fontWeight:400, marginTop:4 }}>New arrivals</h2>
                </div>
                <Link href="/browse?tag=New" style={{ fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gold-d)', textDecoration:'none' }}>See new →</Link>
              </div>
            </Reveal>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(clamp(150px,20vw,220px),1fr))', gap:'clamp(12px,2vw,22px)' }}>
              {newArr.map((p, i) => <Reveal key={p.id} delay={Math.min(i, 3) * 90}><ProductCard product={p} /></Reveal>)}
            </div>
          </section>
        )}

        {/* ── ASSURANCE BAND — BIS hallmark & lifetime promise ── */}
        <section style={{ margin:'clamp(44px,6vw,72px) auto 0', background:'#2F4A3F' }}>
          <div style={{ maxWidth:1180, margin:'0 auto', padding:'clamp(40px,5vw,64px) clamp(16px,3vw,24px)' }}>
            <Reveal>
              <div style={{ textAlign:'center', marginBottom:'clamp(28px,4vw,44px)' }}>
                <p style={{ fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(237,230,216,0.55)' }}>The GLYA promise</p>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(24px,3.2vw,42px)', fontWeight:400, marginTop:8, color:'#EDE6D8' }}>Certified today, valued forever</h2>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="trust-grid">
                {[
                  { icon:'◈', label:'BIS Hallmarked',        sub:'Every piece certified for purity' },
                  { icon:'∞', label:'Lifetime Exchange',     sub:'Buyback guaranteed, always' },
                  { icon:'↺', label:'30-Day Returns',        sub:'Free & fully insured' },
                  { icon:'▲', label:'Free Insured Shipping', sub:'Pan India delivery' },
                ].map(t => (
                  <div key={t.label} className="trust-item">
                    <div style={{ fontSize:24, color:'var(--gold)' }}>{t.icon}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, marginTop:10, color:'#EDE6D8' }}>{t.label}</div>
                    <div style={{ fontSize:12, color:'rgba(237,230,216,0.6)', marginTop:5 }}>{t.sub}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── BLOG PREVIEW ── */}
        <section style={{ maxWidth:1180, margin:'clamp(44px,6vw,72px) auto 0', padding:'0 clamp(16px,3vw,24px)' }}>
          <Reveal>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:32, flexWrap:'wrap', gap:12 }}>
              <div>
                <p style={{ fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)' }}>From the journal</p>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,3vw,40px)', fontWeight:400, marginTop:4 }}>Stories &amp; guides</h2>
              </div>
              <Link href="/journal" style={{ fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gold-d)', textDecoration:'none' }}>All posts →</Link>
            </div>
          </Reveal>
          {blogs.length > 0 ? (
            <div className="blog-grid">
              {blogs.map((post, i) => (
                <Reveal key={post.id} delay={Math.min(i, 2) * 110}>
                <Link href={`/journal/${post.slug || post.id}`} className="blog-card" style={{ textDecoration:'none', color:'inherit' }}>
                  <div style={{ width:'100%', aspectRatio:'16/9', background:'var(--paper2)', borderRadius:3, overflow:'hidden', position:'relative', border:'1px solid var(--line)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, color:'var(--line)' }}>
                    {post.coverImage
                      ? <Image src={post.coverImage} alt={post.title} fill sizes="(max-width:900px) 100vw,33vw" className="blog-img" style={{ objectFit:'contain' }} />
                      : <span>◈</span>
                    }
                  </div>
                  <div style={{ fontSize:11.5, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold-d)', margin:'14px 0 8px' }}>{post.category}</div>
                  <h3 className="blog-title" style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(18px,2vw,24px)', lineHeight:1.2 }}>{post.title}</h3>
                  <p style={{ color:'var(--ink2)', fontSize:14, lineHeight:1.65, marginTop:8, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{post.excerpt}</p>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginTop:12 }}>
                    <span style={{ fontSize:11.5, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--muted)' }}>{post.date}</span>
                    <span style={{ fontSize:11.5, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold-d)', display:'inline-flex', alignItems:'center', gap:7 }}>
                      Read <span className="blog-arrow">→</span>
                    </span>
                  </div>
                </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'clamp(16px,2.5vw,32px)' }}>
              {[
                { cat:'Buying Guide', title:'How to buy gold jewellery in India', sub:'Understanding hallmarking, karats, and what to look for.' },
                { cat:'Jewellery Education', title:'Diamond vs. Polki: which is right for you?', sub:'A guide to the most popular stones in Indian bridal jewellery.' },
                { cat:'Care', title:'How to care for your fine jewellery', sub:'Simple practices that keep your pieces looking new for decades.' },
              ].map(b => (
                <Link key={b.title} href="/journal" style={{ textDecoration:'none', color:'inherit' }}>
                  <div style={{ width:'100%', aspectRatio:'16/9', background:'var(--paper2)', borderRadius:3, border:'1px solid var(--line)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, color:'var(--line)' }}>◈</div>
                  <div style={{ fontSize:11.5, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold-d)', margin:'14px 0 8px' }}>{b.cat}</div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(18px,2vw,24px)', lineHeight:1.2 }}>{b.title}</h3>
                  <p style={{ color:'var(--ink2)', fontSize:14, lineHeight:1.65, marginTop:8 }}>{b.sub}</p>
                </Link>
              ))}
            </div>
          )}
        </section>


      </main>
      <Footer />
    </>
  );
}
