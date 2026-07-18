'use client';
import { useState, useRef, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore, useMetalRates } from '@/lib/store';
import { priceOf, inr, sizeInfo, karatLabel } from '@/lib/catalog';
import { flyToHeader, popElement } from '@/lib/fly';
import ProductCard from '@/components/ProductCard';
import type { StorefrontProduct } from '@/lib/api';

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(url);
}

/* Admin descriptions may be raw HTML — render it, but strip anything executable first. */
const hasHtml = (s: string) => /<\/?[a-z][\s\S]*>/i.test(s);
function sanitizeHtml(html: string): string {
  return html
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<\/?(script|style|iframe|object|embed)[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*(["']?)\s*javascript:[^"'\s>]*/gi, '$1=$2#');
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }    = use(params);
  const router    = useRouter();
  const goldRate      = useStore(s => s.goldRate);
  const rates         = useMetalRates();
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
  const [openAcc,   setOpenAcc]   = useState<number>(0);
  const [galleryIdx,setGalleryIdx]= useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

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

  const pr     = priceOf(p, karat, rates);
  const si     = sizeInfo(p);
  const wished = wishlist.includes(p.id);
  const rate22 = inr(Math.round(goldRate * 0.916));
  const karats = p.metal === 'Platinum' ? ['PT950'] : p.metal === 'Silver' ? ['925'] : p.metal === 'Diamond' ? [p.karat] : (p.cat === 'Rings' || p.cat === 'Necklaces') ? ['18K','22K'] : ['22K','18K'];


  const related = allProducts.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);

  function handleAdd() {
    if (!p) return;
    const key = [p.id, karat, size, engraving].join('|');
    addToCart({ key, id: p.id, karat, size, engraving });
    /* Let the product fly into the bag before the cart page takes over. */
    if (galleryRef.current) {
      flyToHeader(galleryRef.current, 'cart', images[galleryIdx] ?? null);
      setTimeout(() => router.push('/cart'), 900);
    } else {
      router.push('/cart');
    }
  }

  const activeImg = images[galleryIdx];

  return (
    <main style={{ maxWidth:1360, margin:'0 auto', padding:'clamp(20px,3vw,40px) clamp(16px,3vw,28px)', animation:'glyaFade 0.5s ease' }}>
      <style>{`
        .pdp-grid { display:grid; grid-template-columns:1fr 1fr; gap:clamp(28px,4vw,60px); align-items:start; }
        @media(max-width:760px){ .pdp-grid { grid-template-columns:1fr; } }
        .pdp-gallery-sticky { position:sticky; top:96px; }
        @media(max-width:760px){ .pdp-gallery-sticky { position:static; } }
        .pdp-html p { margin:0 0 10px; }
        .pdp-html p:last-child { margin-bottom:0; }
        .pdp-html h1, .pdp-html h2, .pdp-html h3, .pdp-html h4 { font-family:'Cormorant Garamond',serif; font-weight:500; color:var(--ink); margin:14px 0 8px; line-height:1.2; }
        .pdp-html h1 { font-size:24px; } .pdp-html h2 { font-size:21px; } .pdp-html h3 { font-size:18px; } .pdp-html h4 { font-size:16px; }
        .pdp-html ul, .pdp-html ol { margin:0 0 10px; padding-left:20px; }
        .pdp-html li { margin-bottom:4px; }
        .pdp-html a { color:var(--gold-d); }
        .pdp-html strong, .pdp-html b { font-weight:500; color:var(--ink); }
        .pdp-html img { max-width:100%; height:auto; border-radius:3px; }
        .pdp-html table { width:100%; border-collapse:collapse; margin:10px 0; font-size:13.5px; }
        .pdp-html th, .pdp-html td { border:1px solid var(--line); padding:8px 12px; text-align:left; }
        .pdp-html th { background:var(--paper2); font-weight:500; }
        .pdp-html hr { border:none; border-top:1px solid var(--line); margin:14px 0; }
        .pdp-html blockquote { margin:10px 0; padding:8px 16px; border-left:2px solid var(--gold); background:var(--paper2); font-style:italic; }
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
          <div ref={galleryRef} style={{ position:'relative', width:'100%', aspectRatio:'1/1', background:'var(--paper2)', borderRadius:4, overflow:'hidden', border:'1px solid var(--line)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, color:'var(--line)' }}>
            {activeImg
              ? isVideoUrl(activeImg)
                ? <video src={activeImg} controls playsInline style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }} />
                : <Image src={activeImg} alt={p.name} fill sizes="(max-width:760px) 100vw,50vw" style={{ objectFit:'contain' }} />
              : <span>◈</span>
            }
          </div>
          {images.length > 1 && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginTop:12 }}>
              {images.slice(0,4).map((img, i) => (
                <div key={i} onClick={() => setGalleryIdx(i)}
                  style={{ cursor:'pointer', border:`2px solid ${galleryIdx===i?'var(--gold)':'var(--line)'}`, borderRadius:3, overflow:'hidden', aspectRatio:'1/1', position:'relative', background:'var(--paper2)', transition:'border-color .18s', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {isVideoUrl(img)
                    ? <>
                        <video src={img} muted style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                        <span style={{ position:'absolute', fontSize:20, color:'#fff', background:'rgba(0,0,0,0.4)', borderRadius:'50%', width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>▶</span>
                      </>
                    : <Image src={img} alt={p.name} fill sizes="100px" style={{ objectFit:'contain' }} />
                  }
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
            {p.metal === 'Diamond'
              ? 'Live price · based on the certified stone value'
              : p.metal === 'Platinum'
              ? `Live price · updates with the ${inr(rates.platinum)}/g platinum rate`
              : p.metal === 'Silver'
              ? `Live price · updates with the ${inr(rates.silver)}/g silver rate`
              : `Live price · updates with the ${rate22}/g gold rate`}
          </div>

          {/* KARAT */}
          <div style={{ marginTop:28 }}>
            <div style={{ fontSize:12, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:12, fontWeight:500 }}>Metal &amp; purity</div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {karats.map(k => (
                <div key={k} onClick={() => setKarat(k)}
                  style={{ cursor:'pointer', padding:'12px 20px', border:`1px solid ${karat===k?'var(--gold)':'var(--line)'}`, background:karat===k?'rgba(176,141,87,0.08)':'transparent', color:karat===k?'#93733E':'var(--ink)', borderRadius:2, fontSize:14, transition:'border-color .15s, background .15s, color .15s' }}>
                  {karatLabel(k)}
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
            <button onClick={e => {
                popElement(e.currentTarget);
                if (!wished && galleryRef.current) flyToHeader(galleryRef.current, 'wish', images[galleryIdx] ?? null);
                toggleWish(p.id);
              }}
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

        </div>
      </div>

      {/* PRODUCT DETAILS */}
      <div style={{ marginTop:'clamp(48px,6vw,72px)' }}>
        <style>{`
          .pdp-tab-bar { display:flex; border-bottom:1px solid var(--line); overflow-x:auto; scrollbar-width:none; }
          .pdp-tab-bar::-webkit-scrollbar { display:none; }
          .pdp-tab-btn { cursor:pointer; background:none; border:none; outline:none; font-family:'Cormorant Garamond',serif; font-size:clamp(17px,2vw,21px); padding:16px clamp(18px,2.5vw,34px); white-space:nowrap; letter-spacing:0.01em; transition:color .2s; border-bottom:2px solid transparent; margin-bottom:-1px; }
          .pdp-tab-btn.active { color:#93733E; border-bottom-color:var(--gold); }
          .pdp-tab-btn:not(.active) { color:var(--muted); }
          .pdp-tab-btn:hover:not(.active) { color:var(--ink); }
          .pdp-spec-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:12px; }
          .pdp-cert-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:14px; }
          .pdp-care-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:14px; }
          @media(max-width:640px){ .pdp-spec-grid { grid-template-columns:repeat(2,1fr); } }
        `}</style>

        {/* Tab bar */}
        <div className="pdp-tab-bar">
          {['Description','Specifications','Certification','Care & Shipping'].map((tab,i) => (
            <button key={tab} className={`pdp-tab-btn${openAcc===i?' active':''}`} onClick={() => setOpenAcc(i)}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding:'36px 0 8px', animation:'glyaFade 0.25s ease' }} key={openAcc}>

          {/* 0 — Description */}
          {openAcc === 0 && (
            <div style={{ maxWidth:720 }}>
              {hasHtml(p.blurb)
                ? <div className="pdp-html" style={{ fontSize:15.5, lineHeight:1.85, color:'var(--ink2)', fontWeight:300 }}
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(p.blurb) }} />
                : <p style={{ fontSize:15.5, lineHeight:1.85, color:'var(--ink2)', fontWeight:300, margin:0 }}>
                    {p.blurb || `Crafted in ${p.metal} ${karat}, this piece weighs ${p.weightG}g${p.gem ? ` and features ${p.gem}` : ''}. Every piece is BIS hallmarked and ships with an authenticity certificate.`}
                  </p>
              }
            </div>
          )}

          {/* 1 — Specifications */}
          {openAcc === 1 && (
            <div className="pdp-spec-grid">
              {([
                { label:'Metal',       value: p.metal },
                { label:'Purity',      value: karat },
                { label:'Weight',      value: `${p.weightG} g` },
                { label:'Gemstone',    value: p.gem || 'No gemstones' },
                { label:'Category',    value: p.cat },
                { label:'Collection',  value: p.col },
                ...(p.rating > 0 ? [{ label:'Rating', value: `${p.rating.toFixed(1)} / 5.0` }] : []),
                ...(p.reviews > 0 ? [{ label:'Reviews', value: `${p.reviews} verified` }] : []),
              ] as { label:string; value:string }[]).map(s => (
                <div key={s.label} style={{ padding:'18px 20px', background:'var(--paper2)', border:'1px solid var(--line)', borderRadius:3 }}>
                  <div style={{ fontSize:10.5, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)', marginBottom:8 }}>{s.label}</div>
                  <div style={{ fontSize:15, fontWeight:500, color:'var(--ink)', lineHeight:1.3 }}>{s.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* 2 — Certification */}
          {openAcc === 2 && (
            <div className="pdp-cert-grid">
              {([
                { icon:'◈', title:'BIS Hallmarked',         desc:'Metal purity is certified by the Bureau of Indian Standards — India\'s highest quality assurance for gold and silver.' },
                ...(p.gem ? [{ icon:'✦', title:'IGI Certified Stone', desc:'The gemstone accompanying this piece is certified by the International Gemological Institute.' }] : []),
                { icon:'◻', title:'GST Invoice Included',   desc:'A valid GST tax invoice is issued with every purchase for full legal compliance and resale traceability.' },
                { icon:'◇', title:'Certificate of Authenticity', desc:'Each piece ships with a signed certificate of authenticity and a detailed product care booklet.' },
              ] as { icon:string; title:string; desc:string }[]).map(c => (
                <div key={c.title} style={{ padding:'26px 22px', background:'var(--paper2)', border:'1px solid var(--line)', borderRadius:3 }}>
                  <div style={{ fontSize:28, color:'var(--gold)', marginBottom:14, lineHeight:1 }}>{c.icon}</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, color:'var(--ink)', marginBottom:8, lineHeight:1.2 }}>{c.title}</div>
                  <div style={{ fontSize:13.5, color:'var(--ink2)', lineHeight:1.7, fontWeight:300 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* 3 — Care & Shipping */}
          {openAcc === 3 && (
            <div className="pdp-care-grid">
              {([
                { icon:'↑', title:'Free Insured Shipping',   desc:'Complimentary insured shipping across India. Orders are dispatched in 1–2 business days in tamper-evident packaging.' },
                { icon:'↺', title:'30-Day Free Returns',     desc:'Changed your mind? Returns are accepted within 30 days of delivery — no questions asked, fully refunded.' },
                { icon:'∞', title:'Lifetime Exchange',       desc:'Exchange your piece at the prevailing gold rate at any time. We also offer a lifetime buyback at fair market value.' },
                { icon:'✧', title:'Care Instructions',       desc:'Store in the provided pouch away from moisture and sunlight. Polish gently with a soft cloth. Avoid harsh chemicals, perfumes, and ultrasonic cleaners.' },
              ] as { icon:string; title:string; desc:string }[]).map(item => (
                <div key={item.title} style={{ display:'flex', gap:18, padding:'22px 20px', background:'var(--paper2)', border:'1px solid var(--line)', borderRadius:3 }}>
                  <div style={{ fontSize:24, color:'var(--gold)', flexShrink:0, lineHeight:1.3 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:'var(--ink)', marginBottom:6, lineHeight:1.2 }}>{item.title}</div>
                    <div style={{ fontSize:13.5, color:'var(--ink2)', lineHeight:1.7, fontWeight:300 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <section style={{ marginTop:'clamp(40px,6vw,80px)' }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(26px,3vw,38px)', marginBottom:24 }}>You may also love</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(200px,42vw),1fr))', gap:'clamp(14px,2vw,24px)' }}>
            {related.map(r => <ProductCard key={r.id} product={r} />)}
          </div>
        </section>
      )}
    </main>
  );
}
