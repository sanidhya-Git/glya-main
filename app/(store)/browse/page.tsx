'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore, useMetalRates } from '@/lib/store';
import { inr, priceOf } from '@/lib/catalog';
import ProductCard from '@/components/ProductCard';

/* ── presentational constants ── */
const SORTS = [
  { value:'featured',   label:'Featured' },
  { value:'priceLow',   label:'Price: Low to High' },
  { value:'priceHigh',  label:'Price: High to Low' },
  { value:'rating',     label:'Top Rated' },
  { value:'new',        label:'Newest' },
];

function uniq(vals: string[]): string[] {
  return Array.from(new Set(vals.filter(Boolean)));
}

function buildTitle(col: string, cats: string[], metal: string, gem: string, q: string): string {
  const cat = cats[cats.length - 1] ?? '';
  if (q) return `Search: "${q}"`;
  if (gem && gem !== 'all') return gem;
  if (gem === 'all') return 'Gemstones';
  if (col) {
    if (cat) return `${col} — ${cat}`;
    return col;
  }
  if (cat) return cat;
  if (metal && metal !== 'All') return `${metal} Jewellery`;
  return 'All Jewellery';
}

function buildBreadcrumb(col: string, cats: string[], metal: string, gem: string): string[] {
  const crumbs = ['Home'];
  if (gem) crumbs.push('Gemstones');
  if (col) crumbs.push(col);
  crumbs.push(...cats);
  if (!col && cats.length === 0 && !gem && metal && metal !== 'All') crumbs.push(`${metal} Jewellery`);
  return crumbs;
}

/* ── decode param helpers ── */
function dp(val: string | null): string { return val ? decodeURIComponent(val.replace(/\+/g, ' ')) : ''; }

function BrowseContent() {
  const searchParams    = useSearchParams();
  const goldRate        = useStore(s => s.goldRate);
  const rates           = useMetalRates();
  const adminProducts   = useStore(s => s.adminProducts);
  const adminCategories = useStore(s => s.adminCategories);
  const productsLoaded  = useStore(s => s.productsLoaded);
  const products        = adminProducts;

  /* read all URL params on init */
  const urlCol   = dp(searchParams.get('col'));
  const urlCat   = dp(searchParams.get('cat'));
  const urlSub   = dp(searchParams.get('sub'));
  const urlType  = dp(searchParams.get('type'));
  const urlMetal = dp(searchParams.get('metal'));
  const urlGem   = dp(searchParams.get('gem'));
  const urlTag   = dp(searchParams.get('tag'));
  const urlQ     = dp(searchParams.get('q'));

  const [activeCol,   setActiveCol]   = useState(urlCol);
  const [activeCat,   setActiveCat]   = useState(urlCat);
  const [activeSub,   setActiveSub]   = useState(urlSub);
  const [activeType,  setActiveType]  = useState(urlType);
  const [activeMetal, setActiveMetal] = useState(urlMetal || 'All');
  const [activeGem,   setActiveGem]   = useState(urlGem);
  const [sort,        setSort]        = useState('featured');
  const [filterOpen,  setFilterOpen]  = useState(false);

  /* Re-sync filters when a nav link changes the URL while already on /browse */
  useEffect(() => {
    setActiveCol(urlCol);
    setActiveCat(urlCat);
    setActiveSub(urlSub);
    setActiveType(urlType);
    setActiveMetal(urlMetal || 'All');
    setActiveGem(urlGem);
  }, [urlCol, urlCat, urlSub, urlType, urlMetal, urlGem]);

  /* ── filter options derived from API data ── */
  const collections = uniq(products.map(p => p.col));
  const gemstones   = uniq(products.filter(p => p.gemValue > 0).map(p => p.gem));
  const metals      = ['All', ...uniq([
    ...products.map(p => p.metal),
    ...(products.some(p => p.gemValue > 0) ? ['Diamond'] : []),
  ])];

  /* ── LOADING STATE ── */
  if (!productsLoaded) {
    return (
      <main style={{ maxWidth:1360, margin:'0 auto', padding:'clamp(20px,3vw,40px) clamp(16px,3vw,28px)', animation:'glyaFade 0.5s ease' }}>
        <style>{`
          @keyframes glyaShimmer { 0% { background-position:-460px 0; } 100% { background-position:460px 0; } }
          @keyframes glyaBreathe { 0%,100% { opacity:.45; } 50% { opacity:1; } }
        `}</style>
        <div style={{ textAlign:'center', padding:'34px 0 40px' }}>
          <div style={{ fontSize:26, color:'var(--gold)', animation:'glyaBreathe 1.8s ease-in-out infinite' }}>◈</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(26px,3.6vw,42px)', marginTop:12, color:'var(--ink)' }}>Curating the collection</h1>
          <p style={{ color:'var(--muted)', fontSize:13.5, marginTop:8, letterSpacing:'.04em' }}>Fetching pieces at today&rsquo;s gold rate…</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(200px,42vw),1fr))', gap:'clamp(12px,2vw,24px)' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ border:'1px solid var(--line)', borderRadius:3, overflow:'hidden', background:'var(--paper)' }}>
              <div style={{ aspectRatio:'1/1', background:'linear-gradient(90deg, var(--paper2) 25%, rgba(176,141,87,0.10) 50%, var(--paper2) 75%)', backgroundSize:'920px 100%', animation:'glyaShimmer 1.5s linear infinite' }} />
              <div style={{ padding:'13px 14px' }}>
                <div style={{ height:12, width:'72%', background:'var(--paper2)', borderRadius:2, marginBottom:9 }} />
                <div style={{ height:12, width:'42%', background:'var(--paper2)', borderRadius:2 }} />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  /* ── FILTER LOGIC ── */
  let list = products.slice();

  /* collection */
  if (activeCol) list = list.filter(p => p.col === activeCol);

  /* category hierarchy — a name at any level matches the product's catPath
     (main / sub / product-category); legacy products fall back to p.cat */
  const inCatPath = (p: (typeof products)[number], name: string) =>
    (p.catPath && p.catPath.includes(name)) || p.cat === name;
  if (activeCat)  list = list.filter(p => inCatPath(p, activeCat) || p.name.toLowerCase().includes(activeCat.toLowerCase()));
  if (activeSub)  list = list.filter(p => inCatPath(p, activeSub));
  if (activeType) list = list.filter(p => inCatPath(p, activeType));

  /* metal */
  if (activeMetal && activeMetal !== 'All') {
    if      (activeMetal === 'Gold')     list = list.filter(p => p.metal === 'Gold');
    else if (activeMetal === 'Silver')   list = list.filter(p => p.metal === 'Silver');
    else if (activeMetal === 'Platinum') list = list.filter(p => p.metal === 'Platinum');
    else if (activeMetal === 'Diamond')  list = list.filter(p => p.gemValue > 0);
    else                                  list = list.filter(p => p.karat === activeMetal);
  }

  /* gemstone — show all gem-set pieces for now */
  if (activeGem && activeGem !== 'all') list = list.filter(p => p.gemValue > 0);
  else if (activeGem === 'all')         list = list.filter(p => p.gemValue > 0);

  /* tag */
  if (urlTag) list = list.filter(p => p.tag === urlTag);

  /* search query */
  if (urlQ) list = list.filter(p =>
    p.name.toLowerCase().includes(urlQ.toLowerCase()) ||
    p.cat.toLowerCase().includes(urlQ.toLowerCase()) ||
    p.col.toLowerCase().includes(urlQ.toLowerCase())
  );

  /* sort */
  const priceMap = new Map(products.map(p => [p.id, priceOf(p, undefined, rates).total]));
  if (sort === 'priceLow')  list.sort((a, b) => (priceMap.get(a.id)||0) - (priceMap.get(b.id)||0));
  if (sort === 'priceHigh') list.sort((a, b) => (priceMap.get(b.id)||0) - (priceMap.get(a.id)||0));
  if (sort === 'rating')    list.sort((a, b) => b.rating - a.rating);
  if (sort === 'new')       list.sort((a, b) => (b.tag==='New'?1:0)-(a.tag==='New'?1:0));

  const catLevels  = [activeCat, activeSub, activeType].filter(Boolean);
  const pageTitle  = buildTitle(activeCol, catLevels, activeMetal, activeGem, urlQ);
  const crumbs     = buildBreadcrumb(activeCol, catLevels, activeMetal, activeGem);
  const catList    = activeCol ? uniq(products.filter(p => p.col === activeCol).map(p => p.cat)) : [];
  const showGems   = !!activeGem;
  const rate22     = inr(Math.round(goldRate * 0.916));
  const activeCount = (activeCol?1:0)+(activeCat?1:0)+(activeSub?1:0)+(activeType?1:0)+((activeMetal&&activeMetal!=='All')?1:0)+(activeGem?1:0);

  function resetAll() { setActiveCol(''); setActiveCat(''); setActiveSub(''); setActiveType(''); setActiveMetal('All'); setActiveGem(''); setFilterOpen(false); }

  function chip(active: boolean) {
    return {
      border:     active ? 'var(--gold)'           : 'var(--line)',
      background: active ? 'rgba(176,141,87,0.10)' : 'transparent',
      color:      active ? '#785D30'               : 'var(--ink2)',
    };
  }

  const FilterPanel = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

      {/* Collections */}
      <div>
        <div style={{ fontSize:11, letterSpacing:'.18em', textTransform:'uppercase', color:'var(--ink)', marginBottom:12, fontWeight:600 }}>Collection</div>
        <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
          <div onClick={() => { setActiveCol(''); setActiveCat(''); }} style={{ cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', fontSize:13.5, color:!activeCol?'#785D30':'var(--ink2)', borderBottom:'1px solid var(--line)', fontWeight:!activeCol?500:400, transition:'color .14s' }}>
            <span>All</span>
            <span style={{ fontSize:11.5, color:'var(--muted)' }}>{products.length}</span>
          </div>
          {collections.map(c => {
            const count = products.filter(p => p.col === c).length;
            return (
              <div key={c} onClick={() => { setActiveCol(c); setActiveCat(''); }}
                style={{ cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', fontSize:13.5, color:activeCol===c?'#785D30':'var(--ink2)', borderBottom:'1px solid var(--line)', fontWeight:activeCol===c?500:400, transition:'color .14s' }}>
                <span>{c}</span>
                <span style={{ fontSize:11.5, color:'var(--muted)' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories from admin OR sub-categories when collection selected */}
      {(catList.length > 0 || adminCategories.length > 0) && (
        <div>
          <div style={{ fontSize:11, letterSpacing:'.18em', textTransform:'uppercase', color:'var(--ink)', marginBottom:12, fontWeight:600 }}>Category</div>
          <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
            <div onClick={() => setActiveCat('')} style={{ cursor:'pointer', padding:'7px 0', fontSize:13, color:!activeCat?'#785D30':'var(--ink2)', borderBottom:'1px solid var(--line)', fontWeight:!activeCat?500:400, transition:'color .14s' }}>All</div>
            {(catList.length > 0 ? catList : adminCategories).map(c => (
              <div key={c} onClick={() => setActiveCat(c)}
                style={{ cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', fontSize:13, color:activeCat===c?'#785D30':'var(--ink2)', borderBottom:'1px solid var(--line)', fontWeight:activeCat===c?500:400, transition:'color .14s' }}>
                <span>{c}</span>
                <span style={{ fontSize:11.5, color:'var(--muted)' }}>{products.filter(p => p.cat === c).length || ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gemstones */}
      {showGems && (
        <div>
          <div style={{ fontSize:11, letterSpacing:'.18em', textTransform:'uppercase', color:'var(--ink)', marginBottom:12, fontWeight:600 }}>Gemstone</div>
          <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
            <div onClick={() => setActiveGem('all')} style={{ cursor:'pointer', padding:'7px 0', fontSize:13, color:activeGem==='all'?'#785D30':'var(--ink2)', borderBottom:'1px solid var(--line)', fontWeight:activeGem==='all'?500:400, transition:'color .14s' }}>All Gemstones</div>
            {gemstones.map(g => (
              <div key={g} onClick={() => setActiveGem(g)}
                style={{ cursor:'pointer', padding:'7px 0', fontSize:13, color:activeGem===g?'#785D30':'var(--ink2)', borderBottom:'1px solid var(--line)', fontWeight:activeGem===g?500:400, transition:'color .14s' }}>
                {g}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metal */}
      <div>
        <div style={{ fontSize:11, letterSpacing:'.18em', textTransform:'uppercase', color:'var(--ink)', marginBottom:12, fontWeight:600 }}>Metal</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
          {metals.map(m => (
            <div key={m} onClick={() => setActiveMetal(m)}
              style={{ cursor:'pointer', fontSize:12.5, padding:'7px 12px', borderRadius:2, border:`1px solid ${chip(activeMetal===m).border}`, background:chip(activeMetal===m).background, color:chip(activeMetal===m).color, transition:'border-color .15s, background .15s, color .15s' }}>
              {m}
            </div>
          ))}
        </div>
      </div>

      <button onClick={resetAll}
        style={{ cursor:'pointer', background:'transparent', border:'1px solid var(--line)', color:'var(--muted)', padding:'10px', fontSize:11.5, letterSpacing:'.08em', textTransform:'uppercase', borderRadius:2 }}>
        Reset all filters
      </button>
    </div>
  );

  return (
    <main style={{ maxWidth:1360, margin:'0 auto', padding:'clamp(20px,3vw,40px) clamp(16px,3vw,28px)', animation:'glyaFade 0.5s ease' }}>
      <style>{`
        .browse-layout { display:grid; grid-template-columns:minmax(0,230px) 1fr; gap:clamp(20px,3vw,44px); align-items:start; }
        .browse-sidebar { position:sticky; top:88px; }
        .browse-filter-btn { display:none; align-items:center; gap:8px; cursor:pointer; background:var(--paper); border:1px solid var(--line); color:var(--ink); padding:10px 18px; font-size:12.5px; letter-spacing:.08em; text-transform:uppercase; border-radius:2px; }
        @media (max-width:780px){
          .browse-layout { grid-template-columns:1fr; }
          .browse-sidebar { display:none !important; }
          .browse-filter-btn { display:flex !important; }
        }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ fontSize:11.5, letterSpacing:'.16em', textTransform:'uppercase', color:'var(--muted)', marginBottom:10, display:'flex', gap:7, flexWrap:'wrap' }}>
        {crumbs.map((c, i) => (
          <span key={i} style={{ display:'flex', alignItems:'center', gap:7 }}>
            {i > 0 && <span>·</span>}
            {i === 0 ? <Link href="/" style={{ color:'var(--muted)', textDecoration:'none' }}>{c}</Link> : <span style={{ color: i === crumbs.length-1 ? 'var(--ink)' : 'var(--muted)' }}>{c}</span>}
          </span>
        ))}
      </div>

      {/* Title + controls */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:12, marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(28px,4.5vw,52px)', lineHeight:1 }}>{pageTitle}</h1>
          <p style={{ color:'var(--muted)', marginTop:6, fontSize:13.5 }}>
            {list.length} piece{list.length !== 1 ? 's' : ''} · live at 22K {rate22}/g
          </p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button className="browse-filter-btn" onClick={() => setFilterOpen(o => !o)}>
            <span style={{ fontSize:16 }}>⊞</span>
            <span>Filters{activeCount > 0 ? ` (${activeCount})` : ''}</span>
          </button>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ border:'1px solid var(--line)', background:'var(--paper)', padding:'9px 12px', fontSize:13, borderRadius:2, cursor:'pointer', color:'var(--ink)' }}>
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
          {activeCol   && <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, padding:'5px 11px', background:'rgba(176,141,87,.10)', border:'1px solid var(--gold)', borderRadius:20, color:'#785D30' }}>{activeCol} <button onClick={() => { setActiveCol(''); setActiveCat(''); }} style={{ background:'none', border:'none', cursor:'pointer', color:'#785D30', padding:0, lineHeight:1, fontSize:14 }}>×</button></span>}
          {activeCat   && <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, padding:'5px 11px', background:'rgba(176,141,87,.10)', border:'1px solid var(--gold)', borderRadius:20, color:'#785D30' }}>{activeCat} <button onClick={() => { setActiveCat(''); setActiveSub(''); setActiveType(''); }} style={{ background:'none', border:'none', cursor:'pointer', color:'#785D30', padding:0, lineHeight:1, fontSize:14 }}>×</button></span>}
          {activeSub   && <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, padding:'5px 11px', background:'rgba(176,141,87,.10)', border:'1px solid var(--gold)', borderRadius:20, color:'#785D30' }}>{activeSub} <button onClick={() => { setActiveSub(''); setActiveType(''); }} style={{ background:'none', border:'none', cursor:'pointer', color:'#785D30', padding:0, lineHeight:1, fontSize:14 }}>×</button></span>}
          {activeType  && <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, padding:'5px 11px', background:'rgba(176,141,87,.10)', border:'1px solid var(--gold)', borderRadius:20, color:'#785D30' }}>{activeType} <button onClick={() => setActiveType('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#785D30', padding:0, lineHeight:1, fontSize:14 }}>×</button></span>}
          {activeMetal && activeMetal !== 'All' && <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, padding:'5px 11px', background:'rgba(176,141,87,.10)', border:'1px solid var(--gold)', borderRadius:20, color:'#785D30' }}>{activeMetal} <button onClick={() => setActiveMetal('All')} style={{ background:'none', border:'none', cursor:'pointer', color:'#785D30', padding:0, lineHeight:1, fontSize:14 }}>×</button></span>}
          {activeGem   && <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, padding:'5px 11px', background:'rgba(176,141,87,.10)', border:'1px solid var(--gold)', borderRadius:20, color:'#785D30' }}>{activeGem === 'all' ? 'All Gemstones' : activeGem} <button onClick={() => setActiveGem('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#785D30', padding:0, lineHeight:1, fontSize:14 }}>×</button></span>}
          <button onClick={resetAll} style={{ fontSize:12, padding:'5px 11px', background:'none', border:'1px solid var(--line)', borderRadius:20, cursor:'pointer', color:'var(--muted)', letterSpacing:'.06em' }}>Clear all</button>
        </div>
      )}

      {/* Mobile filter panel */}
      {filterOpen && (
        <div style={{ background:'var(--paper2)', border:'1px solid var(--line)', borderRadius:3, padding:20, marginBottom:20, animation:'glyaSlideDown 0.2s ease' }}>
          <FilterPanel />
        </div>
      )}

      <div className="browse-layout">
        {/* Sidebar */}
        <aside className="browse-sidebar">
          <FilterPanel />
        </aside>

        {/* Grid */}
        <div>
          {list.length > 0 ? (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, borderBottom:'1px solid var(--line)', paddingBottom:14, flexWrap:'wrap', gap:10 }}>
                <span style={{ fontSize:13, color:'var(--muted)' }}>Showing {list.length} result{list.length!==1?'s':''}</span>
                {activeCount > 0 && (
                  <button onClick={resetAll} style={{ cursor:'pointer', background:'transparent', border:'none', fontSize:12.5, color:'var(--gold-d)', letterSpacing:'.06em' }}>
                    Clear filters ×
                  </button>
                )}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(200px,42vw),1fr))', gap:'clamp(12px,2vw,24px)' }}>
                {list.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          ) : products.length === 0 ? (
            <div style={{ textAlign:'center', padding:'90px 20px', color:'var(--muted)', border:'1px solid var(--line)', borderRadius:3, background:'var(--paper2)' }}>
              <div style={{ fontSize:30, color:'var(--gold)', marginBottom:16 }}>◈</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, color:'var(--ink)', marginBottom:12 }}>The boutique is being dressed</div>
              <p style={{ fontSize:14.5, lineHeight:1.8 }}>
                Our artisans are preparing the collection.<br />New pieces will appear here very soon.
              </p>
              <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:28, flexWrap:'wrap' }}>
                <Link href="/" style={{ display:'inline-flex', alignItems:'center', padding:'12px 26px', background:'var(--ink)', color:'#F7F2E8', fontSize:12, letterSpacing:'.12em', textTransform:'uppercase', textDecoration:'none', borderRadius:2 }}>
                  Back to home
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'80px 20px', color:'var(--muted)', border:'1px solid var(--line)', borderRadius:3 }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, color:'var(--ink)', marginBottom:12 }}>{pageTitle}</div>
              <p style={{ fontSize:14.5, lineHeight:1.8 }}>
                This collection is being curated.<br />New pieces arrive regularly.
              </p>
              <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:28, flexWrap:'wrap' }}>
                <button onClick={resetAll} style={{ cursor:'pointer', background:'var(--ink)', color:'#F7F2E8', border:'none', padding:'12px 26px', fontSize:12, letterSpacing:'.12em', textTransform:'uppercase', borderRadius:2 }}>
                  Browse all jewellery
                </button>
                <Link href="/" style={{ display:'inline-flex', alignItems:'center', padding:'12px 26px', border:'1px solid var(--line)', fontSize:12, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--ink)', textDecoration:'none', borderRadius:2 }}>
                  Back to home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function BrowsePage() {
  return <Suspense><BrowseContent /></Suspense>;
}
