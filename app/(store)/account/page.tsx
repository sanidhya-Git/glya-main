'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useStore, useMetalRates, type OrderLine } from '@/lib/store';
import { inr, priceOf } from '@/lib/catalog';

const TABS = ['Orders', 'Wishlist', 'Profile', 'Addresses'];

const TAB_MAP: Record<string, string> = {
  orders: 'Orders', wishlist: 'Wishlist',
  profile: 'Profile', addresses: 'Addresses',
};

function statusColor(s: string) {
  if (s === 'Delivered')  return '#2F7A5B';
  if (s === 'Cancelled')  return '#B4553B';
  if (s === 'Dispatched' || s === 'In transit') return '#B08D57';
  return '#555';
}

function AccountContent() {
  const searchParams = useSearchParams();
  const initialTab   = TAB_MAP[searchParams.get('tab')?.toLowerCase() || ''] || 'Orders';
  const [tab, setTab] = useState(initialTab);

  const user       = useStore(s => s.user);
  const orders     = useStore(s => s.orders);
  const mergeOrders = useStore(s => s.mergeOrders);
  const wishlist   = useStore(s => s.wishlist);
  const toggleWish = useStore(s => s.toggleWish);
  const adminProducts  = useStore(s => s.adminProducts);
  const productsLoaded = useStore(s => s.productsLoaded);

  // Sync orders from server when user is logged in
  useEffect(() => {
    if (!user?.email) return;
    fetch(`/api/user-orders?email=${encodeURIComponent(user.email)}`)
      .then(r => r.ok ? r.json() : { orders: [] })
      .then(data => { if (data.orders?.length) mergeOrders(data.orders); })
      .catch(() => {});
  }, [user?.email, mergeOrders]);

  const rates      = useMetalRates();
  const latest     = orders[0];
  const firstName  = latest?.address.firstName || 'Guest';
  const lastName   = latest?.address.lastName  || '';

  const wishLoading = !productsLoaded && wishlist.length > 0;
  const wishItems   = adminProducts.filter(p => wishlist.includes(p.id));

  /* Admin-merged orders carry productId 0, so fall back to a name match */
  const lineProduct = (l: OrderLine) =>
    adminProducts.find(p => p.id === l.productId) ??
    adminProducts.find(p => p.name.toLowerCase() === l.name.toLowerCase());

  return (
    <main style={{ maxWidth:1200, margin:'0 auto', padding:'clamp(20px,3vw,48px) clamp(16px,3vw,28px)', animation:'glyaFade 0.5s ease' }}>
      <style>{`
        .account-tabs { display:flex; gap:2px; border-bottom:1px solid var(--line); margin-bottom:28px; overflow-x:auto; -webkit-overflow-scrolling:touch; }
        .account-tabs::-webkit-scrollbar { display:none; }
      `}</style>

      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:28 }}>
        <div>
          <p style={{ fontSize:11.5, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--muted)' }}>My account</p>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:500, fontSize:'clamp(28px,4vw,46px)', marginTop:6 }}>{firstName} {lastName}</h1>
        </div>
      </div>

      <div className="account-tabs">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ cursor:'pointer', background:'none', border:'none', padding:'11px 18px', fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:tab===t?'var(--ink)':'var(--muted)', borderBottom:`2px solid ${tab===t?'var(--gold)':'transparent'}`, flexShrink:0, whiteSpace:'nowrap' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Orders' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {orders.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--muted)' }}>
              <div style={{ fontSize:40, marginBottom:14 }}>◈</div>
              <p style={{ fontSize:15 }}>No orders yet.</p>
              <Link href="/browse" style={{ display:'inline-block', marginTop:16, padding:'12px 28px', border:'1px solid var(--ink)', fontSize:12.5, letterSpacing:'0.1em', textTransform:'uppercase', textDecoration:'none', color:'var(--ink)' }}>Start shopping</Link>
            </div>
          ) : orders.map(o => (
            <div key={o.orderNo} style={{ border:'1px solid var(--line)', borderRadius:3, overflow:'hidden' }}>
              <div style={{ background:'var(--paper2)', padding:'12px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
                <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
                  <div><div style={{ fontSize:10.5, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)' }}>Order</div><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17 }}>{o.orderNo}</div></div>
                  <div><div style={{ fontSize:10.5, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)' }}>Date</div><div style={{ fontSize:13.5 }}>{new Date(o.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div></div>
                  <div><div style={{ fontSize:10.5, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)' }}>Total</div><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17 }}>{inr(o.total)}</div></div>
                </div>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <span style={{ fontSize:12, padding:'4px 10px', borderRadius:2, background:`${statusColor(o.status)}15`, color:statusColor(o.status) }}>{o.status}</span>
                  <Link href={`/track?order=${o.orderNo}`} style={{ fontSize:12.5, color:'var(--gold-d)', textDecoration:'none' }}>Track →</Link>
                </div>
              </div>
              <div style={{ padding:'14px 18px', display:'flex', gap:12, overflowX:'auto' }}>
                {o.lines.map((l, li) => {
                  const prod = lineProduct(l);
                  const img  = prod?.images?.[0];
                  const inner = (
                    <div style={{ display:'flex', gap:10, alignItems:'center', minWidth:200, flexShrink:0 }}>
                      <div style={{ width:56, height:66, background:'var(--paper2)', borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, color:'var(--line)', flexShrink:0, position:'relative', overflow:'hidden' }}>
                        {img ? <Image src={img} alt={l.name} fill sizes="56px" style={{ objectFit:'cover' }} /> : '◈'}
                      </div>
                      <div>
                        <div style={{ fontSize:14, fontFamily:"'Cormorant Garamond',serif", color:'var(--ink)' }}>{l.name}</div>
                        <div style={{ fontSize:11.5, color:'var(--muted)' }}>{l.karat} {l.metal} · Qty {l.qty}{l.size ? ` · Size ${l.size}` : ''}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:2 }}>
                          <span style={{ fontSize:13, color:'var(--em)' }}>{inr(l.unitPrice)}</span>
                          {prod && prod.rating > 0 && <span style={{ fontSize:11.5, color:'var(--muted)' }}>★ {prod.rating.toFixed(1)}</span>}
                        </div>
                      </div>
                    </div>
                  );
                  return prod
                    ? <Link key={li} href={`/product/${prod.id}`} style={{ textDecoration:'none' }}>{inner}</Link>
                    : <div key={li}>{inner}</div>;
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Wishlist' && (
        <div>
          {wishLoading ? (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--muted)' }}>
              <div style={{ fontSize:40, marginBottom:14, color:'var(--gold)', animation:'glyaFade 1.2s ease infinite alternate' }}>◈</div>
              <p style={{ fontSize:15 }}>Gathering your saved pieces…</p>
            </div>
          ) : wishItems.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--muted)' }}>
              <div style={{ fontSize:40, marginBottom:14 }}>♡</div>
              <p style={{ fontSize:15 }}>Your wishlist is empty.</p>
              <Link href="/browse" style={{ display:'inline-block', marginTop:16, padding:'12px 28px', border:'1px solid var(--ink)', fontSize:12.5, letterSpacing:'0.1em', textTransform:'uppercase', textDecoration:'none', color:'var(--ink)' }}>Explore pieces</Link>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(200px,42vw),1fr))', gap:18 }}>
              {wishItems.map(p => {
                const img = p.images?.[0];
                const pr  = priceOf(p, undefined, rates);
                return (
                <div key={p.id} style={{ border:'1px solid var(--line)', borderRadius:2, overflow:'hidden' }}>
                  <Link href={`/product/${p.id}`} style={{ textDecoration:'none', color:'inherit' }}>
                    <div style={{ height:200, background:'var(--paper2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, color:'var(--line)', position:'relative', overflow:'hidden' }}>
                      {img ? <Image src={img} alt={p.name} fill sizes="(max-width:600px) 50vw, 25vw" style={{ objectFit:'cover' }} /> : '◈'}
                    </div>
                    <div style={{ padding:'12px 14px' }}>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17 }}>{p.name}</div>
                      <div style={{ fontSize:11.5, color:'var(--muted)', marginTop:2 }}>{p.karat} {p.metal}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
                        <span style={{ fontSize:14.5, fontWeight:500 }}>{inr(pr.total)}</span>
                        {p.rating > 0 && <span style={{ fontSize:12, color:'var(--muted)' }}>★ {p.rating.toFixed(1)}</span>}
                      </div>
                    </div>
                  </Link>
                  <div style={{ padding:'0 14px 12px', display:'flex', gap:7 }}>
                    <Link href={`/product/${p.id}`} style={{ flex:1, textAlign:'center', background:'var(--ink)', color:'#F7F2E8', padding:'9px 12px', fontSize:11.5, letterSpacing:'0.1em', textTransform:'uppercase', textDecoration:'none', borderRadius:2 }}>View</Link>
                    <button onClick={() => toggleWish(p.id)} style={{ cursor:'pointer', border:'1px solid var(--line)', background:'transparent', padding:'9px 12px', fontSize:11.5, letterSpacing:'0.08em', textTransform:'uppercase', borderRadius:2, color:'var(--muted)' }}>Remove</button>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'Profile' && (
        <div style={{ maxWidth:500 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, marginBottom:16 }}>Personal details</div>
          <div style={{ display:'grid', gap:13 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:13 }}>
              <div><label style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)', display:'block', marginBottom:5 }}>First name</label><input defaultValue={firstName} style={{ width:'100%', border:'1px solid var(--line)', background:'var(--paper)', padding:'12px 13px', fontSize:14, borderRadius:2, boxSizing:'border-box' }} /></div>
              <div><label style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)', display:'block', marginBottom:5 }}>Last name</label><input defaultValue={lastName} style={{ width:'100%', border:'1px solid var(--line)', background:'var(--paper)', padding:'12px 13px', fontSize:14, borderRadius:2, boxSizing:'border-box' }} /></div>
            </div>
            <div><label style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)', display:'block', marginBottom:5 }}>Mobile</label><input defaultValue={latest?.address.mobile||''} style={{ width:'100%', border:'1px solid var(--line)', background:'var(--paper)', padding:'12px 13px', fontSize:14, borderRadius:2, boxSizing:'border-box' }} /></div>
          </div>
          <p style={{ fontSize:12.5, color:'var(--muted)', marginTop:12 }}>Details are derived from your most recent order.</p>
        </div>
      )}

      {tab === 'Addresses' && (
        <div style={{ maxWidth:600 }}>
          {orders.length === 0 ? (
            <p style={{ color:'var(--muted)', fontSize:15 }}>No saved addresses. Place an order to save your first address.</p>
          ) : (() => {
            const unique = Array.from(new Map(orders.map(o => [o.address.mobile, o.address])).values());
            return (
              <div style={{ display:'grid', gap:14 }}>
                {unique.map((a, i) => (
                  <div key={i} style={{ border:'1px solid var(--line)', borderRadius:3, padding:'16px 18px' }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18 }}>{a.firstName} {a.lastName}</div>
                    <div style={{ fontSize:13.5, color:'var(--ink2)', marginTop:6, lineHeight:1.8 }}>
                      {a.line1}{a.line2?`, ${a.line2}`:''}<br />{a.city}, {a.state} – {a.pincode}<br />{a.mobile}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<main style={{ padding:'80px 28px', textAlign:'center', color:'var(--muted)' }}>Loading…</main>}>
      <AccountContent />
    </Suspense>
  );
}
