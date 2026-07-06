'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { catalog, inr, priceOf } from '@/lib/catalog';
import ProductCard from '@/components/ProductCard';

/* ── filter constants ── */
const COLLECTIONS = [
  { label: 'BK Gold',           col: 'BK+Gold' },
  { label: 'BK Silver',         col: 'BK+Silver' },
  { label: 'Gold Jewellery',    col: 'Gold+Jewellery' },
  { label: 'Silver Jewellery',  col: 'Silver+Jewellery' },
  { label: 'Diamond Jewellery', col: 'Diamond+Jewellery' },
];

const BK_GOLD_CATS    = ['Gold Designer Badges','Oval Gold Badges','Round Gold Badges','Pendants','Rings','Rakhi','Baba Articles','Earrings'];
const BK_SILVER_CATS  = ['Silver Articles','Badges','Pendant','Rings','Rakhi'];
const GOLD_JWLRY_CATS = ['Gold Gifts','Gold Rings','Rajasthani Gold Jewelry','Gold Mangalsutra','Gold Earrings Diamond Polki','Gold Necklace Set','Gold Child Najariya','Gold Bangles','Gold Pendants'];
const SILVER_JWLRY_CATS = ['Silver Idols / Murti','Silver Cutstone Earrings','Silver Cutstone Pendants','Silver Cutstone Rings','Silver Puja Articles','Silverware','Silver Mangalsutra','Silver Jutti'];
const DIAMOND_CATS    = ['Diamond Earrings','Diamond Rings','Diamond Necklace Set','Diamond Pendants'];
const GEMSTONES       = ['Emerald (Panna)','Yellow Sapphire (Pukhraj)','Pearl (Moti)','Ruby (Manik)','Blue Sapphire (Neelam)','Coral (Moonga)','Diamond'];

const METALS = ['All','Gold','Silver','Platinum','Diamond'];

const SORTS = [
  { value:'featured',   label:'Featured' },
  { value:'priceLow',   label:'Price: Low to High' },
  { value:'priceHigh',  label:'Price: High to Low' },
  { value:'rating',     label:'Top Rated' },
  { value:'new',        label:'Newest' },
];

function colCats(col: string): string[] {
  if (col === 'BK Gold')           return BK_GOLD_CATS;
  if (col === 'BK Silver')         return BK_SILVER_CATS;
  if (col === 'Gold Jewellery')    return GOLD_JWLRY_CATS;
  if (col === 'Silver Jewellery')  return SILVER_JWLRY_CATS;
  if (col === 'Diamond Jewellery') return DIAMOND_CATS;
  return [];
}

function buildTitle(col: string, cat: string, metal: string, gem: string, q: string): string {
  if (q) return `Search: "${q}"`;
  if (gem && gem !== 'all') return gem;
  if (gem === 'all') return 'Gemstones';
  if (col) {
    if (cat) return `${col} — ${cat}`;
    return col;
  }
  if (metal && metal !== 'All') return `${metal} Jewellery`;
  return 'All Jewellery';
}

function buildBreadcrumb(col: string, cat: string, metal: string, gem: string): string[] {
  const crumbs = ['Home'];
  if (gem) crumbs.push('Gemstones');
  if (col) crumbs.push(col);
  if (cat) crumbs.push(cat);
  if (!col && !cat && !gem && metal && metal !== 'All') crumbs.push(`${metal} Jewellery`);
  return crumbs;
}

/* ── decode param helpers ── */
function dp(val: string | null): string { return val ? decodeURIComponent(val.replace(/\+/g, ' ')) : ''; }

function BrowseContent() {
  const searchParams  = useSearchParams();
  const goldRate      = useStore(s => s.goldRate);
  const adminProducts = useStore(s => s.adminProducts);
  const products      = adminProducts.length > 0 ? adminProducts : catalog;

  /* read all URL params on init */
  const urlCol   = dp(searchParams.get('col'));
  const urlCat   = dp(searchParams.get('cat'));
  const urlMetal = dp(searchParams.get('metal'));
  const urlGem   = dp(searchParams.get('gem'));
  const urlTag   = dp(searchParams.get('tag'));
  const urlQ     = dp(searchParams.get('q'));

  const [activeCol,   setActiveCol]   = useState(urlCol);
  const [activeCat,   setActiveCat]   = useState(urlCat);
  const [activeMetal, setActiveMetal] = useState(urlMetal || 'All');
  const [activeGem,   setActiveGem]   = useState(urlGem);
  const [sort,        setSort]        = useState('featured');
  const [filterOpen,  setFilterOpen]  = useState(false);

  /* ── FILTER LOGIC ── */
  let list = products.slice();

  /* collection */
  if (activeCol) list = list.filter(p => p.col === activeCol);

  /* subcategory */
  if (activeCat) list = list.filter(p => p.cat === activeCat || p.name.toLowerCase().includes(activeCat.toLowerCase()));

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
  const priceMap = new Map(products.map(p => [p.id, priceOf(p, undefined, goldRate).total]));
  if (sort === 'priceLow')  list.sort((a, b) => (priceMap.get(a.id)||0) - (priceMap.get(b.id)||0));
  if (sort === 'priceHigh') list.sort((a, b) => (priceMap.get(b.id)||0) - (priceMap.get(a.id)||0));
  if (sort === 'rating')    list.sort((a, b) => b.rating - a.rating);
  if (sort === 'new')       list.sort((a, b) => (b.tag==='New'?1:0)-(a.tag==='New'?1:0));

  const pageTitle  = buildTitle(activeCol, activeCat, activeMetal, activeGem, urlQ);
  const crumbs     = buildBreadcrumb(activeCol, activeCat, activeMetal, activeGem);
  const catList    = activeCol ? colCats(activeCol) : [];
  const showGems   = !!activeGem;
  const rate22     = inr(Math.round(goldRate * 0.916));
  const activeCount = (activeCol?1:0)+(activeCat?1:0)+((activeMetal&&activeMetal!=='All')?1:0)+(activeGem?1:0);

  function resetAll() { setActiveCol(''); setActiveCat(''); setActiveMetal('All'); setActiveGem(''); setFilterOpen(false); }

  function chip(active: boolean) {
    return {
      border:     active ? 'var(--gold)'           : 'var(--line)',
      background: active ? 'rgba(176,141,87,0.10)' : 'transparent',
      color:      active ? '#93733E'               : 'var(--ink2)',
    };
  }

  const FilterPanel = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

      {/* Collections */}
      <div>
        <div style={{ fontSize:11, letterSpacing:'.18em', textTransform:'uppercase', color:'var(--ink)', marginBottom:12, fontWeight:600 }}>Collection</div>
        <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
          <div onClick={() => { setActiveCol(''); setActiveCat(''); }} style={{ cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', fontSize:13.5, color:!activeCol?'#93733E':'var(--ink2)', borderBottom:'1px solid var(--line)', fontWeight:!activeCol?500:400 }}>
            <span>All</span>
            <span style={{ fontSize:11.5, color:'var(--muted)' }}>{products.length}</span>
          </div>
          {COLLECTIONS.map(c => {
            const decoded = c.col.replace(/\+/g, ' ');
            const count   = products.filter(p => p.col === decoded).length;
            return (
              <div key={c.label} onClick={() => { setActiveCol(decoded); setActiveCat(''); }}
                style={{ cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', fontSize:13.5, color:activeCol===decoded?'#93733E':'var(--ink2)', borderBottom:'1px solid var(--line)', fontWeight:activeCol===decoded?500:400 }}>
                <span>{c.label}</span>
                <span style={{ fontSize:11.5, color:'var(--muted)' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sub-categories (only when a collection is selected) */}
      {catList.length > 0 && (
        <div>
          <div style={{ fontSize:11, letterSpacing:'.18em', textTransform:'uppercase', color:'var(--ink)', marginBottom:12, fontWeight:600 }}>Category</div>
          <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
            <div onClick={() => setActiveCat('')} style={{ cursor:'pointer', padding:'7px 0', fontSize:13, color:!activeCat?'#93733E':'var(--ink2)', borderBottom:'1px solid var(--line)', fontWeight:!activeCat?500:400 }}>All</div>
            {catList.map(c => (
              <div key={c} onClick={() => setActiveCat(c)}
                style={{ cursor:'pointer', padding:'7px 0', fontSize:13, color:activeCat===c?'#93733E':'var(--ink2)', borderBottom:'1px solid var(--line)', fontWeight:activeCat===c?500:400 }}>
                {c}
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
            <div onClick={() => setActiveGem('all')} style={{ cursor:'pointer', padding:'7px 0', fontSize:13, color:activeGem==='all'?'#93733E':'var(--ink2)', borderBottom:'1px solid var(--line)', fontWeight:activeGem==='all'?500:400 }}>All Gemstones</div>
            {GEMSTONES.map(g => (
              <div key={g} onClick={() => setActiveGem(g)}
                style={{ cursor:'pointer', padding:'7px 0', fontSize:13, color:activeGem===g?'#93733E':'var(--ink2)', borderBottom:'1px solid var(--line)', fontWeight:activeGem===g?500:400 }}>
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
          {METALS.map(m => (
            <div key={m} onClick={() => setActiveMetal(m)}
              style={{ cursor:'pointer', fontSize:12.5, padding:'7px 12px', borderRadius:2, border:`1px solid ${chip(activeMetal===m).border}`, background:chip(activeMetal===m).background, color:chip(activeMetal===m).color }}>
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
          {activeCol   && <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, padding:'5px 11px', background:'rgba(176,141,87,.10)', border:'1px solid var(--gold)', borderRadius:20, color:'#93733E' }}>{activeCol} <button onClick={() => { setActiveCol(''); setActiveCat(''); }} style={{ background:'none', border:'none', cursor:'pointer', color:'#93733E', padding:0, lineHeight:1, fontSize:14 }}>×</button></span>}
          {activeCat   && <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, padding:'5px 11px', background:'rgba(176,141,87,.10)', border:'1px solid var(--gold)', borderRadius:20, color:'#93733E' }}>{activeCat} <button onClick={() => setActiveCat('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#93733E', padding:0, lineHeight:1, fontSize:14 }}>×</button></span>}
          {activeMetal && activeMetal !== 'All' && <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, padding:'5px 11px', background:'rgba(176,141,87,.10)', border:'1px solid var(--gold)', borderRadius:20, color:'#93733E' }}>{activeMetal} <button onClick={() => setActiveMetal('All')} style={{ background:'none', border:'none', cursor:'pointer', color:'#93733E', padding:0, lineHeight:1, fontSize:14 }}>×</button></span>}
          {activeGem   && <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, padding:'5px 11px', background:'rgba(176,141,87,.10)', border:'1px solid var(--gold)', borderRadius:20, color:'#93733E' }}>{activeGem === 'all' ? 'All Gemstones' : activeGem} <button onClick={() => setActiveGem('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#93733E', padding:0, lineHeight:1, fontSize:14 }}>×</button></span>}
          <button onClick={resetAll} style={{ fontSize:12, padding:'5px 11px', background:'none', border:'1px solid var(--line)', borderRadius:20, cursor:'pointer', color:'var(--muted)', letterSpacing:'.06em' }}>Clear all</button>
        </div>
      )}

      {/* Mobile filter panel */}
      {filterOpen && (
        <div style={{ background:'var(--paper2)', border:'1px solid var(--line)', borderRadius:3, padding:20, marginBottom:20 }}>
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
                  <button onClick={resetAll} style={{ cursor:'pointer', background:'transparent', border:'none', fontSize:12.5, color:'var(--gold)', letterSpacing:'.06em' }}>
                    Clear filters ×
                  </button>
                )}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'clamp(12px,2vw,24px)' }}>
                {list.map(p => <ProductCard key={p.id} product={p} goldRate={goldRate} />)}
              </div>
            </>
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
