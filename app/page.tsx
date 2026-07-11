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
import SiteLoader from '@/components/SiteLoader';

const DEFAULT_CATS = [
  { name: 'Rings',        icon: '◉', href: '/browse?cat=Rings' },
  { name: 'Necklaces',    icon: '◈', href: '/browse?cat=Necklaces' },
  { name: 'Bangles',      icon: '○', href: '/browse?cat=Bangles' },
  { name: 'Earrings',     icon: '◎', href: '/browse?cat=Earrings' },
  { name: 'Bridal',       icon: '✦', href: '/browse?col=Bridal' },
  { name: 'New arrivals', icon: '▲', href: '/browse?tag=New' },
];

const ICONS = ['◉','◈','○','◎','✦','▲','◇','⬡','◐','◑'];

export default function Home() {
  const adminProducts   = useStore(s => s.adminProducts);
  const productsLoaded  = useStore(s => s.productsLoaded);
  const adminJournal    = useStore(s => s.adminJournal);
  const adminCategories = useStore(s => s.adminCategories);

  const products = adminProducts;
  const tagged   = products.filter(p => p.tag === 'Bestseller' || p.tag === 'Trending').slice(0, 8);
  const trending = tagged.length > 0 ? tagged : products.slice(0, 8);
  const newArr   = products.filter(p => p.tag === 'New').slice(0, 4);

  const cats = adminCategories.length > 0
    ? adminCategories.map((name, i) => ({ name, icon: ICONS[i % ICONS.length], href: `/browse?cat=${encodeURIComponent(name)}` }))
    : DEFAULT_CATS;

  const blogs = adminJournal.filter(p => p.status === 'Published').slice(0, 3);

  return (
    <>
      <SiteLoader />
      <style>{`
        .home-editorial { display:grid; grid-template-columns:1fr 1fr; border:1px solid var(--line); overflow:hidden; border-radius:4px; }
        .home-editorial-img { background:#2F4A3F; min-height:340px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
        .home-editorial-text { padding:clamp(28px,5vw,56px) clamp(22px,4vw,48px); display:flex; flex-direction:column; justify-content:center; }
        .trust-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:0; border:1px solid var(--line); }
        .trust-item { padding:clamp(16px,2.5vw,28px) clamp(12px,2vw,22px); text-align:center; border-right:1px solid var(--line); }
        .trust-item:last-child { border-right:none; }
        .blog-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(16px,2.5vw,32px); }
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
          .trust-item:nth-child(3) { border-top:1px solid var(--line); }
          .trust-item:nth-child(4) { border-top:1px solid var(--line); border-right:none; }
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

        {/* ── TRUST BAND ── */}
        <div className="trust-grid" style={{ maxWidth:1180, margin:'0 auto', marginTop:'clamp(32px,5vw,56px)', marginLeft:'clamp(16px,3vw,auto)', marginRight:'clamp(16px,3vw,auto)' }}>
          {[
            { icon:'◈', label:'BIS Hallmarked', sub:'Every piece certified' },
            { icon:'↺', label:'30-Day Returns',  sub:'Free & insured' },
            { icon:'∞', label:'Lifetime Exchange',sub:'Buyback guaranteed' },
            { icon:'▲', label:'Free Shipping',   sub:'Pan India, insured' },
          ].map(t => (
            <div key={t.icon} className="trust-item">
              <div style={{ fontSize:22, color:'var(--gold)' }}>{t.icon}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, marginTop:8 }}>{t.label}</div>
              <div style={{ fontSize:12, color:'var(--muted)', marginTop:4 }}>{t.sub}</div>
            </div>
          ))}
        </div>

        {/* ── CATEGORIES ── */}
        <section style={{ maxWidth:1180, margin:'0 auto', padding:'clamp(44px,6vw,72px) clamp(16px,3vw,24px) 0' }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <p style={{ fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)' }}>Shop by category</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(26px,3.5vw,44px)', fontWeight:400, marginTop:8 }}>Find your piece</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:`repeat(auto-fill,minmax(clamp(100px,14vw,160px),1fr))`, gap:12 }}>
            {cats.map(c => (
              <Link key={c.name} href={c.href}
                style={{ textDecoration:'none', display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'clamp(18px,3vw,26px) 12px', border:'1px solid var(--line)', background:'#fff', borderRadius:3, color:'var(--ink)', transition:'border-color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor='var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor='var(--line)')}
              >
                <span style={{ fontSize:24, color:'var(--gold)' }}>{c.icon}</span>
                <span style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:500, textAlign:'center', lineHeight:1.3 }}>{c.name}</span>
              </Link>
            ))}
          </div>
        </section>

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
                  <div className="home-skel" style={{ width:'100%', aspectRatio:'4/5' }} />
                  <div className="home-skel" style={{ width:'70%', height:14, marginTop:12, border:'none' }} />
                  <div className="home-skel" style={{ width:'45%', height:12, marginTop:8, border:'none' }} />
                </div>
              ))}
            </div>
          </section>
        ) : trending.length > 0 ? (
          <section style={{ maxWidth:1180, margin:'clamp(44px,6vw,72px) auto 0', padding:'0 clamp(16px,3vw,24px)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28, flexWrap:'wrap', gap:12 }}>
              <div>
                <p style={{ fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)' }}>Right now</p>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,3vw,40px)', fontWeight:400, marginTop:4 }}>Trending pieces</h2>
              </div>
              <Link href="/browse" style={{ fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gold-d)', textDecoration:'none' }}>View all →</Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(clamp(150px,20vw,220px),1fr))', gap:'clamp(12px,2vw,22px)' }}>
              {trending.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        ) : (
          <section style={{ maxWidth:1180, margin:'clamp(44px,6vw,72px) auto 0', padding:'0 clamp(16px,3vw,24px)' }}>
            <div style={{ border:'1px solid var(--line)', borderRadius:4, background:'#fff', textAlign:'center', padding:'clamp(48px,7vw,84px) clamp(20px,4vw,40px)' }}>
              <div style={{ fontSize:34, color:'var(--gold)' }}>◈</div>
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
              <Link href="/browse?col=Bridal"
                style={{ display:'inline-block', marginTop:28, padding:'12px 28px', border:'1px solid var(--ink)', fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', textDecoration:'none', color:'var(--ink)', alignSelf:'flex-start' }}>
                Explore bridal →
              </Link>
            </div>
          </div>
        </section>

        {/* ── NEW ARRIVALS ── */}
        {productsLoaded && newArr.length > 0 && (
          <section style={{ maxWidth:1180, margin:'clamp(44px,6vw,72px) auto 0', padding:'0 clamp(16px,3vw,24px)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28, flexWrap:'wrap', gap:12 }}>
              <div>
                <p style={{ fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)' }}>Just arrived</p>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,3vw,40px)', fontWeight:400, marginTop:4 }}>New arrivals</h2>
              </div>
              <Link href="/browse?tag=New" style={{ fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gold-d)', textDecoration:'none' }}>See new →</Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(clamp(150px,20vw,220px),1fr))', gap:'clamp(12px,2vw,22px)' }}>
              {newArr.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* ── BLOG PREVIEW ── */}
        <section style={{ maxWidth:1180, margin:'clamp(44px,6vw,72px) auto 0', padding:'0 clamp(16px,3vw,24px)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:32, flexWrap:'wrap', gap:12 }}>
            <div>
              <p style={{ fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)' }}>From the journal</p>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,3vw,40px)', fontWeight:400, marginTop:4 }}>Stories &amp; guides</h2>
            </div>
            <Link href="/journal" style={{ fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gold-d)', textDecoration:'none' }}>All posts →</Link>
          </div>
          {blogs.length > 0 ? (
            <div className="blog-grid">
              {blogs.map(post => (
                <Link key={post.id} href={`/journal/${post.id}`} style={{ textDecoration:'none', color:'inherit' }}>
                  <div style={{ width:'100%', aspectRatio:'16/9', background:'var(--paper2)', borderRadius:3, overflow:'hidden', position:'relative', border:'1px solid var(--line)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, color:'var(--line)' }}>
                    {post.coverImage
                      ? <Image src={post.coverImage} alt={post.title} fill sizes="(max-width:900px) 100vw,33vw" style={{ objectFit:'cover' }} />
                      : <span>◈</span>
                    }
                  </div>
                  <div style={{ fontSize:11.5, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold-d)', margin:'14px 0 8px' }}>{post.category}</div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(18px,2vw,24px)', lineHeight:1.2 }}>{post.title}</h3>
                  <p style={{ color:'var(--ink2)', fontSize:14, lineHeight:1.65, marginTop:8, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{post.excerpt}</p>
                </Link>
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
