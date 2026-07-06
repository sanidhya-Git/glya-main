'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { catalog, inr } from '@/lib/catalog';

const TABS = ['Orders', 'Wishlist', 'Rewards', 'Profile', 'Addresses'];

const TAB_MAP: Record<string, string> = {
  orders: 'Orders', wishlist: 'Wishlist', rewards: 'Rewards',
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

  const orders     = useStore(s => s.orders);
  const wishlist   = useStore(s => s.wishlist);
  const toggleWish = useStore(s => s.toggleWish);

  const latest     = orders[0];
  const firstName  = latest?.address.firstName || 'Guest';
  const lastName   = latest?.address.lastName  || '';
  const totalSpend = orders.reduce((a, o) => a + o.total, 0);
  const points     = Math.round(totalSpend / 100);
  const tier       = points >= 5000 ? 'Platinum' : points >= 1000 ? 'Gold Circle' : 'Silver';
  const tierColor  = tier === 'Platinum' ? '#9B7FBA' : tier === 'Gold Circle' ? '#B08D57' : '#8B8272';

  const wishItems  = catalog.filter(p => wishlist.includes(p.id));

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
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:tierColor }}>{tier}</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,3vw,28px)' }}>{points.toLocaleString('en-IN')} pts</div>
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
                  <Link href={`/track?order=${o.orderNo}`} style={{ fontSize:12.5, color:'var(--gold)', textDecoration:'none' }}>Track →</Link>
                </div>
              </div>
              <div style={{ padding:'14px 18px', display:'flex', gap:12, overflowX:'auto' }}>
                {o.lines.map((l, li) => (
                  <div key={li} style={{ display:'flex', gap:10, alignItems:'center', minWidth:180, flexShrink:0 }}>
                    <div style={{ width:44, height:52, background:'var(--paper2)', borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, color:'var(--line)', flexShrink:0 }}>◈</div>
                    <div>
                      <div style={{ fontSize:13, fontFamily:"'Cormorant Garamond',serif" }}>{l.name}</div>
                      <div style={{ fontSize:11.5, color:'var(--muted)' }}>{l.karat} · Qty {l.qty}</div>
                      <div style={{ fontSize:13, color:'var(--em)', marginTop:2 }}>{inr(l.unitPrice)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Wishlist' && (
        <div>
          {wishItems.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--muted)' }}>
              <div style={{ fontSize:40, marginBottom:14 }}>♡</div>
              <p style={{ fontSize:15 }}>Your wishlist is empty.</p>
              <Link href="/browse" style={{ display:'inline-block', marginTop:16, padding:'12px 28px', border:'1px solid var(--ink)', fontSize:12.5, letterSpacing:'0.1em', textTransform:'uppercase', textDecoration:'none', color:'var(--ink)' }}>Explore pieces</Link>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:18 }}>
              {wishItems.map(p => (
                <div key={p.id} style={{ border:'1px solid var(--line)', borderRadius:2, overflow:'hidden' }}>
                  <Link href={`/product/${p.id}`} style={{ textDecoration:'none', color:'inherit' }}>
                    <div style={{ height:200, background:'var(--paper2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, color:'var(--line)' }}>◈</div>
                    <div style={{ padding:'12px 14px' }}>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17 }}>{p.name}</div>
                      <div style={{ fontSize:11.5, color:'var(--muted)', marginTop:2 }}>{p.karat} {p.metal}</div>
                    </div>
                  </Link>
                  <div style={{ padding:'0 14px 12px', display:'flex', gap:7 }}>
                    <Link href={`/product/${p.id}`} style={{ flex:1, textAlign:'center', background:'var(--ink)', color:'#F7F2E8', padding:'9px 12px', fontSize:11.5, letterSpacing:'0.1em', textTransform:'uppercase', textDecoration:'none', borderRadius:2 }}>View</Link>
                    <button onClick={() => toggleWish(p.id)} style={{ cursor:'pointer', border:'1px solid var(--line)', background:'transparent', padding:'9px 12px', fontSize:11.5, letterSpacing:'0.08em', textTransform:'uppercase', borderRadius:2, color:'var(--muted)' }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'Rewards' && (
        <div style={{ maxWidth:640 }}>
          <div style={{ border:'1px solid var(--line)', borderRadius:3, overflow:'hidden' }}>
            <div style={{ background:'var(--ink)', color:'#EDE6D8', padding:'clamp(22px,3vw,32px) clamp(18px,3vw,28px)', textAlign:'center' }}>
              <div style={{ fontSize:11, letterSpacing:'0.16em', textTransform:'uppercase', color:tierColor }}>{tier}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(32px,4vw,42px)', marginTop:6 }}>{points.toLocaleString('en-IN')} pts</div>
              <div style={{ fontSize:13, color:'#9E958A', marginTop:4 }}>Total spend {inr(totalSpend)}</div>
            </div>
            <div style={{ padding:'clamp(18px,3vw,24px)', display:'grid', gap:12 }}>
              {[
                { tier:'Silver',     req:'0 pts',      color:'#8B8272' },
                { tier:'Gold Circle',req:'1,000 pts',  color:'#B08D57' },
                { tier:'Platinum',   req:'5,000 pts',  color:'#9B7FBA' },
              ].map(r => (
                <div key={r.tier} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 14px', border:`1px solid ${r.tier===tier?r.color:'var(--line)'}`, borderRadius:2, background:r.tier===tier?`${r.color}08`:'transparent' }}>
                  <div style={{ display:'flex', gap:9, alignItems:'center' }}>
                    <span style={{ width:9, height:9, borderRadius:'50%', background:r.color, display:'inline-block', flexShrink:0 }}></span>
                    <span style={{ fontSize:14 }}>{r.tier}</span>
                  </div>
                  <span style={{ fontSize:12.5, color:'var(--muted)' }}>{r.req}</span>
                  {r.tier === tier && <span style={{ fontSize:11, color:r.color, letterSpacing:'0.06em' }}>Current</span>}
                </div>
              ))}
              <p style={{ fontSize:12.5, color:'var(--muted)', marginTop:4 }}>Earn 1 point per ₹100 spent. Redeem 100 pts = ₹50 off.</p>
            </div>
          </div>
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
