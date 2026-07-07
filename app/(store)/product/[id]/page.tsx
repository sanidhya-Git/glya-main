'use client';
import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { priceOf, inr, sizeInfo } from '@/lib/catalog';
import ProductCard from '@/components/ProductCard';
import type { StorefrontProduct } from '@/lib/api';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }    = use(params);
  const router    = useRouter();
  const goldRate      = useStore(s => s.goldRate);
  const wishlist      = useStore(s => s.wishlist);
  const toggleWish    = useStore(s => s.toggleWish);
  const addToCart     = useStore(s => s.addToCart);
  const adminProducts  = useStore(s => s.adminProducts);
  const productsLoaded = useStore(s => s.productsLoaded);
  const allProducts    = adminProducts;

  const p         = allProducts.find(x => x.id === Number(id)) as StorefrontProduct | undefined;
  const images    = (p as StorefrontProduct)?.images ?? [];

  const [karatSel,  setKarat]     = useState<string | null>(null);
  const [size,      setSize]      = useState<string | null>(null);
  const [engraving, setEngraving] = useState('');
  const [pincode,   setPincode]   = useState('');
  const [openAcc,   setOpenAcc]   = useState<number | null>(null);
  const [galleryIdx,setGalleryIdx]= useState(0);

  const karat = karatSel || p?.karat || '18K';

  if (!productsLoaded) return (
    <div style={{ padding:'110px 28px', textAlign:'center', animation:'glyaFade 0.5s ease' }}>
      <style>{`@keyframes glyaBreathe { 0%,100% { opacity:.45; } 50% { opacity:1; } }`}</style>
      <div style={{ fontSize:32, color:'var(--gold)', animation:'glyaBreathe 1.8s ease-in-out infinite' }}>◈</div>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(24px,3vw,32px)', marginTop:14, color:'var(--ink)' }}>Preparing this piece</div>
      <p style={{ color:'var(--muted)', fontSize:13.5, marginTop:8, letterSpacing:'.04em' }}>Fetching details at today&rsquo;s gold rate…</p>
    </div>
  );

  if (!p) return (
    <div style={{ padding:'80px 28px', textAlign:'center' }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30 }}>Product not found.</div>
      <p style={{ color:'var(--muted)', fontSize:14, marginTop:10 }}>This piece may have been retired from the collection.</p>
      <Link href="/browse" style={{ display:'inline-flex', alignItems:'center', marginTop:24, padding:'12px 26px', background:'var(--ink)', color:'#F7F2E8', fontSize:12, letterSpacing:'.12em', textTransform:'uppercase', textDecoration:'none', borderRadius:2 }}>
        Browse the collection
      </Link>
    </div>
  );

  const pr     = priceOf(p, karat, goldRate);
  const si     = sizeInfo(p);
  const wished = wishlist.includes(p.id);
  const rate22 = inr(Math.round(goldRate * 0.916));
  const karats = p.metal === 'Platinum' ? ['PT950'] : (p.cat === 'Rings' || p.cat === 'Necklaces') ? ['18K','22K'] : ['22K','18K'];

  const accordions = [
    { title: 'Description',    body: p.blurb || `${p.metal} ${karat} · ${p.weightG}g · ${p.gem || 'No gemstones'}. Hallmarked by BIS.` },
    { title: 'Specifications', body: `${p.metal} ${karat} · ${p.weightG}g · ${p.gem || 'No gemstones'}. Hallmarked by BIS. ${p.reviews > 0 ? p.reviews + ' verified reviews.' : ''}` },
    { title: 'Certification',  body: `${p.gem ? 'IGI certified stone. ' : ''}BIS hallmarked metal. Ships with authenticity certificate and GST invoice.` },
    { title: 'Care & shipping',body: 'Complimentary insured shipping across India. 30-day free returns. Lifetime exchange and buyback available.' },
  ];

  const related = allProducts.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);

  function handleAdd() {
    if (!p) return;
    const key = [p.id, karat, size, engraving].join('|');
    addToCart({ key, id: p.id, karat, size, engraving });
    router.push('/cart');
  }

  const activeImg = images[galleryIdx];

  return (
    <main style={{ maxWidth:1360, margin:'0 auto', padding:'clamp(20px,3vw,40px) clamp(16px,3vw,28px)', animation:'glyaFade 0.5s ease' }}>
      <style>{`
        .pdp-grid { display:grid; grid-template-columns:1fr 1fr; gap:clamp(28px,4vw,60px); align-items:start; }
        @media(max-width:760px){ .pdp-grid { grid-template-columns:1fr; } }
        .pdp-gallery-sticky { position:sticky; top:96px; }
        @media(max-width:760px){ .pdp-gallery-sticky { position:static; } }
      `}</style>

      {/* BREADCRUMB */}
      <div style={{ fontSize:12, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)', marginBottom:22, display:'flex', flexWrap:'wrap', gap:6 }}>
        <Link href="/" style={{ color:'var(--muted)', textDecoration:'none' }}>Home</Link>
        <span>·</span>
        <Link href="/browse" style={{ color:'var(--muted)', textDecoration:'none' }}>Shop</Link>
        <span>·</span>
        <Link href={`/browse?cat=${p.cat}`} style={{ color:'var(--muted)', textDecoration:'none' }}>{p.cat}</Link>
        <span>·</span>
        <span style={{ color:'var(--ink)' }}>{p.name}</span>
      </div>

      <div className="pdp-grid">
        {/* GALLERY */}
        <div className="pdp-gallery-sticky">
          <div style={{ position:'relative', width:'100%', aspectRatio:'1/1', background:'var(--paper2)', borderRadius:4, overflow:'hidden', border:'1px solid var(--line)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, color:'var(--line)' }}>
            {activeImg
              ? <Image src={activeImg} alt={p.name} fill sizes="(max-width:760px) 100vw,50vw" style={{ objectFit:'cover' }} />
              : <span>◈</span>
            }
          </div>
          {images.length > 1 && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginTop:12 }}>
              {images.slice(0,4).map((img, i) => (
                <div key={i} onClick={() => setGalleryIdx(i)}
                  style={{ cursor:'pointer', border:`2px solid ${galleryIdx===i?'var(--gold)':'var(--line)'}`, borderRadius:3, overflow:'hidden', aspectRatio:'1/1', position:'relative', background:'var(--paper2)', transition:'border-color .18s' }}>
                  <Image src={img} alt={p.name} fill sizes="100px" style={{ objectFit:'cover' }} />
                </div>
              ))}
            </div>
          )}
          {images.length === 0 && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginTop:12 }}>
              {[0,1,2,3].map(i => (
                <div key={i} onClick={() => setGalleryIdx(i)}
                  style={{ cursor:'pointer', border:`2px solid ${galleryIdx===i?'var(--gold)':'var(--line)'}`, borderRadius:3, overflow:'hidden', aspectRatio:'1/1', background:'var(--paper2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, color:'var(--line)' }}>◈</div>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div>
          <div style={{ fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--gold-d)', marginBottom:12 }}>{p.col} Collection</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(30px,4.4vw,54px)', lineHeight:1.02 }}>{p.name}</h1>

          <div style={{ display:'flex', alignItems:'center', gap:14, margin:'14px 0 22px', flexWrap:'wrap' }}>
            {p.rating > 0 && <span style={{ fontSize:13.5, color:'var(--gold-d)' }}>★★★★★ {p.rating.toFixed(1)}</span>}
            {p.reviews > 0 && <span style={{ fontSize:13, color:'var(--muted)' }}>{p.reviews} reviews</span>}
            <span style={{ fontSize:11.5, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--em)', border:'1px solid var(--em)', padding:'3px 9px', borderRadius:2 }}>In stock</span>
          </div>

          <div style={{ display:'flex', alignItems:'baseline', gap:14, flexWrap:'wrap' }}>
            <span className="flash" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(32px,4vw,46px)', fontWeight:500 }}>{inr(pr.total)}</span>
            <span style={{ fontSize:13, color:'var(--muted)' }}>inclusive of GST</span>
          </div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginTop:10, fontSize:12.5, color:'var(--em)', background:'rgba(47,74,63,0.06)', padding:'7px 12px', borderRadius:2 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--em)' }}></span>
            Live price · updates with the {rate22}/g gold rate
          </div>

          {/* KARAT */}
          <div style={{ marginTop:28 }}>
            <div style={{ fontSize:12, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:12, fontWeight:500 }}>Metal &amp; purity</div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {karats.map(k => (
                <div key={k} onClick={() => setKarat(k)}
                  style={{ cursor:'pointer', padding:'12px 20px', border:`1px solid ${karat===k?'var(--gold)':'var(--line)'}`, background:karat===k?'rgba(176,141,87,0.08)':'transparent', color:karat===k?'#93733E':'var(--ink)', borderRadius:2, fontSize:14, transition:'border-color .15s, background .15s, color .15s' }}>
                  {k === 'PT950' ? 'Platinum 950' : k + ' Yellow Gold'}
                </div>
              ))}
            </div>
          </div>

          {/* SIZE */}
          {si && (
            <div style={{ marginTop:24 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:12 }}>
                <span style={{ fontSize:12, letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:500 }}>{si.label}</span>
                <span style={{ fontSize:12.5, color:'var(--gold-d)', borderBottom:'1px solid var(--gold)', cursor:'pointer' }}>Size guide</span>
              </div>
              <div style={{ display:'flex', gap:9, flexWrap:'wrap' }}>
                {si.opts.map(o => (
                  <div key={o} onClick={() => setSize(o)}
                    style={{ cursor:'pointer', minWidth:46, textAlign:'center', padding:'11px 12px', border:`1px solid ${size===o?'var(--gold)':'var(--line)'}`, background:size===o?'rgba(176,141,87,0.08)':'transparent', color:size===o?'#93733E':'var(--ink)', borderRadius:2, fontSize:14, transition:'border-color .15s, background .15s, color .15s' }}>{o}</div>
                ))}
              </div>
            </div>
          )}

          {/* ENGRAVING (rings only) */}
          {p.cat === 'Rings' && (
            <div style={{ marginTop:24 }}>
              <div style={{ fontSize:12, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:12, fontWeight:500 }}>Complimentary engraving</div>
              <div style={{ display:'flex', gap:14, alignItems:'stretch', flexWrap:'wrap' }}>
                <input value={engraving} onChange={e => setEngraving(e.target.value)} maxLength={15} placeholder="Add up to 15 characters"
                  style={{ flex:1, minWidth:180, border:'1px solid var(--line)', background:'var(--paper)', padding:'13px 16px', fontSize:14, borderRadius:2 }} />
                <div style={{ minWidth:140, display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#E8D4A6,#C9A865,#B08D57)', borderRadius:40, padding:'0 22px', boxShadow:'inset 0 1px 3px rgba(255,255,255,0.4)' }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontSize:20, color:'#5A4526', letterSpacing:'0.04em' }}>{engraving || 'Preview'}</span>
                </div>
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div style={{ display:'flex', gap:12, marginTop:30, flexWrap:'wrap' }}>
            <button onClick={handleAdd}
              style={{ cursor:'pointer', flex:1, minWidth:180, background:'var(--ink)', color:'#F7F2E8', border:'none', padding:18, fontSize:13, letterSpacing:'0.14em', textTransform:'uppercase', borderRadius:2 }}
              onMouseEnter={e => (e.currentTarget.style.background='var(--gold-d)')}
              onMouseLeave={e => (e.currentTarget.style.background='var(--ink)')}
            >Add to cart</button>
            <button onClick={() => toggleWish(p.id)}
              style={{ cursor:'pointer', width:58, border:'1px solid var(--ink)', background:'transparent', fontSize:20, color:wished?'#B08D57':'var(--ink)', borderRadius:2, transition:'color .18s, border-color .18s' }}>
              {wished ? '♥' : '♡'}
            </button>
          </div>

          {/* DELIVERY */}
          <div style={{ display:'flex', gap:12, marginTop:20, alignItems:'center', border:'1px solid var(--line)', borderRadius:3, padding:'14px 16px', flexWrap:'wrap' }}>
            <span style={{ fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)' }}>Delivery</span>
            <input value={pincode} onChange={e => setPincode(e.target.value)} placeholder="Enter pincode" maxLength={6}
              style={{ border:'1px solid var(--line)', background:'var(--paper)', padding:'9px 12px', fontSize:13.5, borderRadius:2, width:130 }} />
            {pincode.length === 6 && <span style={{ fontSize:13.5, color:'var(--em)' }}>✓ Delivery in 3–5 days</span>}
          </div>

          {/* TRUST */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginTop:24 }}>
            {[
              { icon:'◈', label:'BIS certified' },
              { icon:'↺', label:'30-day returns' },
              { icon:'∞', label:'Lifetime exchange' },
            ].map(t => (
              <div key={t.icon} style={{ textAlign:'center', padding:'14px 8px', background:'var(--paper2)', borderRadius:3 }}>
                <div style={{ fontSize:20 }}>{t.icon}</div>
                <div style={{ fontSize:11.5, letterSpacing:'0.06em', marginTop:6, color:'var(--ink2)' }}>{t.label}</div>
              </div>
            ))}
          </div>

          {/* ACCORDIONS */}
          <div style={{ marginTop:28, borderTop:'1px solid var(--line)' }}>
            {accordions.map((a, i) => (
              <div key={i} style={{ borderBottom:'1px solid var(--line)' }}>
                <div onClick={() => setOpenAcc(openAcc===i?null:i)}
                  style={{ cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'17px 0', fontFamily:"'Cormorant Garamond',serif", fontSize:21, transition:'color .15s' }}>
                  {a.title} <span style={{ fontFamily:'Jost', fontSize:18, color:'var(--muted)' }}>{openAcc===i?'−':'+'}</span>
                </div>
                {openAcc===i && (
                  <div style={{ padding:'0 0 18px', color:'var(--ink2)', fontSize:14.5, lineHeight:1.75, fontWeight:300, animation:'glyaSlideDown 0.2s ease' }}>{a.body}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <section style={{ marginTop:'clamp(40px,6vw,80px)' }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(26px,3vw,38px)', marginBottom:24 }}>You may also love</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'clamp(14px,2vw,24px)' }}>
            {related.map(r => <ProductCard key={r.id} product={r} goldRate={goldRate} />)}
          </div>
        </section>
      )}
    </main>
  );
}
