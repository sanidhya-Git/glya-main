'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useStore, useMetalRates, type OrderLine } from '@/lib/store';
import { inr, priceOf } from '@/lib/catalog';
import { fetchUserProfile, postProfileAction, type UserProfile } from '@/lib/api';
import { COUNTRIES, getCountry, validatePincode } from '@/lib/geo';

const TABS = ['Orders', 'Wishlist', 'Profile', 'Addresses'];

const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid var(--line)', background: 'var(--paper)',
  padding: '12px 13px', fontSize: 14, borderRadius: 2, boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--muted)', display: 'block', marginBottom: 5,
};
const primaryBtn: React.CSSProperties = {
  cursor: 'pointer', background: 'var(--ink)', color: '#F7F2E8', border: 'none',
  padding: '13px 26px', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: 2,
};
const ghostBtn: React.CSSProperties = {
  cursor: 'pointer', background: 'transparent', color: 'var(--ink)', border: '1px solid var(--line)',
  padding: '12px 22px', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 2,
};

const splitName = (name?: string) => {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  return { first: parts[0] ?? '', last: parts.slice(1).join(' ') };
};
const addrKey = (a: { line1?: string; pincode?: string; mobile?: string }) =>
  [a.line1, a.pincode, a.mobile].map(s => String(s ?? '').toLowerCase().replace(/\s+/g, '')).join('|');

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
  const setUser    = useStore(s => s.setUser);
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

  /* ── Profile (server-backed) ── */
  const [profile, setProfile]             = useState<UserProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [pf, setPf]                       = useState({ first: '', last: '', mobile: '' });
  const [pfBusy, setPfBusy]               = useState(false);
  const [pfMsg, setPfMsg]                 = useState('');
  const [pfErr, setPfErr]                 = useState('');
  const [newEmail, setNewEmail]           = useState('');

  /* OTP modal — kind 'phone' verifies profile edits, 'email' verifies an email change */
  const [otpModal, setOtpModal] = useState<null | { kind: 'phone' | 'email'; sentTo: string; token: string; intent: string }>(null);
  const [otpVal, setOtpVal]     = useState('');
  const [otpErr, setOtpErr]     = useState('');
  const [otpBusy, setOtpBusy]   = useState(false);

  /* Address book */
  const [addrOpen, setAddrOpen] = useState(false);
  const [addr, setAddr]         = useState({ first: '', last: '', mobile: '', line1: '', line2: '', country: 'IN', state: '', city: '', pin: '' });
  const [addrBusy, setAddrBusy] = useState(false);
  const [addrErr, setAddrErr]   = useState('');
  const backfilled              = useRef(false);

  const applyProfile = (p: UserProfile) => {
    setProfile(p);
    const { first, last } = splitName(p.name);
    setPf({ first, last, mobile: p.phone || '' });
  };

  useEffect(() => {
    if (!user?.email) { setProfile(null); setProfileLoaded(true); return; }
    let alive = true;
    setProfileLoaded(false);
    fetchUserProfile(user.email).then(p => {
      if (!alive) return;
      if (p) applyProfile(p);
      setProfileLoaded(true);
    });
    return () => { alive = false; };
  }, [user?.email]);

  /* One-time import: users with past orders but an empty address book get
     their unique order addresses saved server-side automatically. */
  useEffect(() => {
    if (backfilled.current || !user?.email || !profileLoaded || !profile) return;
    if (profile.addresses.length > 0 || orders.length === 0) return;
    backfilled.current = true;
    const email = user.email;
    (async () => {
      const unique = Array.from(new Map(orders.map(o => [addrKey(o.address), o.address])).values());
      let latestProfile: UserProfile | undefined;
      for (const a of unique) {
        if (!a.line1) continue;
        const res = await postProfileAction({ action: 'add-address', email, address: {
          label: 'Home', firstName: a.firstName, lastName: a.lastName, mobile: a.mobile,
          line1: a.line1, line2: a.line2, city: a.city, state: a.state,
          country: a.country, countryCode: COUNTRIES.find(c => c.name === a.country)?.code || '',
          pincode: a.pincode,
        } });
        if (res.ok && res.profile) latestProfile = res.profile;
      }
      if (latestProfile) setProfile(latestProfile);
    })();
  }, [user?.email, profileLoaded, profile, orders]);

  async function requestOtp(target: string, intent: string): Promise<string | null> {
    const res  = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: target, intent }),
    }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    if (!res?.ok || !data?.token) {
      setPfErr(data?.error || 'Could not send the verification code. Please try again.');
      return null;
    }
    return data.token as string;
  }

  async function saveProfile() {
    if (!user?.email || pfBusy) return;
    setPfMsg(''); setPfErr('');
    const joined       = `${pf.first} ${pf.last}`.replace(/\s+/g, ' ').trim();
    const nameChanged  = joined !== (profile?.name ?? '').trim();
    const phoneChanged = pf.mobile.trim() !== (profile?.phone ?? '').trim();
    if (!nameChanged && !phoneChanged) { setPfMsg('Everything is already up to date.'); return; }
    setPfBusy(true);
    if (phoneChanged) {
      // Phone changes are confirmed with a code sent to the account email
      const token = await requestOtp(user.email, 'update-profile');
      setPfBusy(false);
      if (token) { setOtpVal(''); setOtpErr(''); setOtpModal({ kind: 'phone', sentTo: user.email, token, intent: 'update-profile' }); }
      return;
    }
    const res = await postProfileAction({ action: 'update', email: user.email, name: joined });
    setPfBusy(false);
    if (res.ok && res.profile) { applyProfile(res.profile); setPfMsg('Details saved.'); }
    else setPfErr(res.error || 'Could not save your details.');
  }

  async function startEmailChange() {
    if (!user?.email || pfBusy) return;
    setPfMsg(''); setPfErr('');
    const next = newEmail.trim();
    if (!next.includes('@')) { setPfErr('Enter a valid new email address.'); return; }
    if (next === user.email) { setPfErr('This is already your account email.'); return; }
    setPfBusy(true);
    // The code goes to the OLD email — proof of ownership before the switch
    const token = await requestOtp(user.email, 'change-email');
    setPfBusy(false);
    if (token) { setOtpVal(''); setOtpErr(''); setOtpModal({ kind: 'email', sentTo: user.email, token, intent: 'change-email' }); }
  }

  async function confirmOtp() {
    if (!otpModal || !user?.email || otpBusy) return;
    setOtpBusy(true); setOtpErr('');
    const joined = `${pf.first} ${pf.last}`.replace(/\s+/g, ' ').trim();
    const res = otpModal.kind === 'phone'
      ? await postProfileAction({ action: 'update', email: user.email, name: joined, phone: pf.mobile.trim(), otp: otpVal.trim(), token: otpModal.token })
      : await postProfileAction({ action: 'change-email', email: user.email, newEmail: newEmail.trim(), otp: otpVal.trim(), token: otpModal.token });
    setOtpBusy(false);
    if (!res.ok) { setOtpErr(res.error || 'Verification failed.'); return; }
    if (res.profile) applyProfile(res.profile);
    if (otpModal.kind === 'email') {
      setUser({ email: newEmail.trim() });
      setNewEmail('');
      setPfMsg('Email updated.');
    } else {
      setPfMsg('Details saved.');
    }
    setOtpModal(null);
  }

  async function resendOtp() {
    if (!otpModal || otpBusy) return;
    setOtpBusy(true); setOtpErr('');
    const token = await requestOtp(otpModal.sentTo, otpModal.intent);
    setOtpBusy(false);
    if (token) { setOtpModal({ ...otpModal, token }); setOtpErr('A new code has been sent.'); }
  }

  async function saveAddress() {
    if (!user?.email || addrBusy) return;
    setAddrErr('');
    const ci = getCountry(addr.country);
    if (!addr.first || !addr.mobile || !addr.line1 || !addr.city) { setAddrErr('Please fill in name, mobile, address and city.'); return; }
    if (ci && ci.states.length > 0 && !addr.state) { setAddrErr('Please select a state.'); return; }
    if (addr.pin && !validatePincode(addr.pin, addr.country)) { setAddrErr(`Invalid ${ci?.pincodeLabel ?? 'postal code'}.`); return; }
    setAddrBusy(true);
    const res = await postProfileAction({ action: 'add-address', email: user.email, address: {
      label: 'Home', firstName: addr.first, lastName: addr.last, mobile: addr.mobile,
      line1: addr.line1, line2: addr.line2, city: addr.city, state: addr.state,
      country: ci?.name || addr.country, countryCode: addr.country, pincode: addr.pin,
    } });
    setAddrBusy(false);
    if (res.ok && res.profile) {
      setProfile(res.profile);
      setAddrOpen(false);
      setAddr({ first: '', last: '', mobile: '', line1: '', line2: '', country: 'IN', state: '', city: '', pin: '' });
    } else setAddrErr(res.error || 'Could not save the address.');
  }

  async function deleteAddress(id?: string) {
    if (!user?.email || !id) return;
    if (!window.confirm('Remove this address?')) return;
    const res = await postProfileAction({ action: 'delete-address', email: user.email, addressId: id });
    if (res.ok && res.profile) setProfile(res.profile);
  }

  async function setDefaultAddress(id?: string) {
    if (!user?.email || !id) return;
    const res = await postProfileAction({ action: 'set-default', email: user.email, addressId: id });
    if (res.ok && res.profile) setProfile(res.profile);
  }

  const rates      = useMetalRates();
  const latest     = orders[0];
  const profSplit  = splitName(profile?.name);
  const firstName  = profSplit.first || latest?.address.firstName || 'Guest';
  const lastName   = profSplit.first ? profSplit.last : (latest?.address.lastName || '');

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
          {!user?.email ? (
            <p style={{ color:'var(--muted)', fontSize:15 }}>Place an order to create your GLYA account — your details will appear here.</p>
          ) : !profileLoaded ? (
            <p style={{ color:'var(--muted)', fontSize:15 }}>Loading your details…</p>
          ) : (
            <>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, marginBottom:16 }}>Personal details</div>
              <div style={{ display:'grid', gap:13 }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:13 }}>
                  <div><label style={labelStyle}>First name</label><input value={pf.first} onChange={e => setPf(p => ({ ...p, first: e.target.value }))} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Last name</label><input value={pf.last} onChange={e => setPf(p => ({ ...p, last: e.target.value }))} style={inputStyle} /></div>
                </div>
                <div>
                  <label style={labelStyle}>Mobile</label>
                  <input value={pf.mobile} onChange={e => setPf(p => ({ ...p, mobile: e.target.value }))} placeholder="Mobile number" style={inputStyle} />
                  <p style={{ fontSize:12, color:'var(--muted)', marginTop:5 }}>Changing your number requires a verification code sent to {user.email}.</p>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginTop:16 }}>
                <button onClick={saveProfile} disabled={pfBusy} style={{ ...primaryBtn, opacity: pfBusy ? 0.5 : 1 }}>{pfBusy ? 'Please wait…' : 'Save details'}</button>
                {pfMsg && <span style={{ fontSize:13, color:'var(--em)' }}>{pfMsg}</span>}
              </div>
              {pfErr && <p style={{ fontSize:13, color:'#C0392B', marginTop:10 }}>{pfErr}</p>}

              <div style={{ borderTop:'1px solid var(--line)', marginTop:30, paddingTop:24 }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, marginBottom:6 }}>Email address</div>
                <p style={{ fontSize:13.5, color:'var(--ink2)', marginBottom:14 }}>Signed in as <b>{user.email}</b></p>
                <label style={labelStyle}>New email</label>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="new@email.com" style={{ ...inputStyle, flex:1, minWidth:200 }} />
                  <button onClick={startEmailChange} disabled={pfBusy} style={{ ...ghostBtn, opacity: pfBusy ? 0.5 : 1, whiteSpace:'nowrap' }}>Change email</button>
                </div>
                <p style={{ fontSize:12, color:'var(--muted)', marginTop:8 }}>For security, we&apos;ll send a verification code to your current email before switching.</p>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'Addresses' && (
        <div style={{ maxWidth:600 }}>
          {!user?.email ? (
            <p style={{ color:'var(--muted)', fontSize:15 }}>Place an order to create your account — your addresses will be saved here.</p>
          ) : !profileLoaded ? (
            <p style={{ color:'var(--muted)', fontSize:15 }}>Loading your addresses…</p>
          ) : (
            <>
              {(profile?.addresses ?? []).filter(a => a.line1).length === 0 && !addrOpen && (
                <p style={{ color:'var(--muted)', fontSize:15, marginBottom:16 }}>No saved addresses yet.</p>
              )}
              <div style={{ display:'grid', gap:14 }}>
                {(profile?.addresses ?? []).filter(a => a.line1).map(a => (
                  <div key={a._id} style={{ border:`1px solid ${a.def ? 'var(--gold)' : 'var(--line)'}`, borderRadius:3, padding:'16px 18px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, flexWrap:'wrap' }}>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18 }}>
                        {a.firstName} {a.lastName}
                        {a.def && <span style={{ fontSize:10.5, fontFamily:'inherit', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gold-d)', border:'1px solid var(--gold)', borderRadius:2, padding:'2px 8px', marginLeft:10, verticalAlign:'middle' }}>Default</span>}
                      </div>
                      <div style={{ display:'flex', gap:12 }}>
                        {!a.def && <button onClick={() => setDefaultAddress(a._id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:'var(--gold-d)', textDecoration:'underline', padding:0 }}>Set default</button>}
                        <button onClick={() => deleteAddress(a._id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:'#B4553B', textDecoration:'underline', padding:0 }}>Delete</button>
                      </div>
                    </div>
                    <div style={{ fontSize:13.5, color:'var(--ink2)', marginTop:6, lineHeight:1.8 }}>
                      {a.line1}{a.line2?`, ${a.line2}`:''}<br />{a.city}{a.state?`, ${a.state}`:''}{a.pincode?` – ${a.pincode}`:''}{a.country?`, ${a.country}`:''}<br />{a.mobile}
                    </div>
                  </div>
                ))}
              </div>

              {!addrOpen ? (
                <button onClick={() => { setAddrOpen(true); setAddrErr(''); }} style={{ ...ghostBtn, marginTop:18 }}>+ Add new address</button>
              ) : (
                <div style={{ border:'1px solid var(--line)', borderRadius:3, padding:'18px 18px 20px', marginTop:18 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, marginBottom:14 }}>New address</div>
                  <div style={{ display:'grid', gap:12 }}>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12 }}>
                      <input placeholder="First name" value={addr.first} onChange={e => setAddr(x => ({ ...x, first: e.target.value }))} style={inputStyle} />
                      <input placeholder="Last name"  value={addr.last}  onChange={e => setAddr(x => ({ ...x, last:  e.target.value }))} style={inputStyle} />
                    </div>
                    <input placeholder="Mobile number"              value={addr.mobile} onChange={e => setAddr(x => ({ ...x, mobile: e.target.value }))} style={inputStyle} />
                    <input placeholder="Flat, house no., building"  value={addr.line1}  onChange={e => setAddr(x => ({ ...x, line1:  e.target.value }))} style={inputStyle} />
                    <input placeholder="Area, street, locality"     value={addr.line2}  onChange={e => setAddr(x => ({ ...x, line2:  e.target.value }))} style={inputStyle} />
                    <select value={addr.country} onChange={e => setAddr(x => ({ ...x, country: e.target.value, state: '', pin: '' }))} style={{ ...inputStyle, cursor:'pointer' }}>
                      {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12 }}>
                      {(() => {
                        const ci = getCountry(addr.country);
                        return ci && ci.states.length > 0 ? (
                          <select value={addr.state} onChange={e => setAddr(x => ({ ...x, state: e.target.value }))} style={{ ...inputStyle, cursor:'pointer' }}>
                            <option value="">Select state</option>
                            {ci.states.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : (
                          <input placeholder="State / Region" value={addr.state} onChange={e => setAddr(x => ({ ...x, state: e.target.value }))} style={inputStyle} />
                        );
                      })()}
                      <input placeholder="City" value={addr.city} onChange={e => setAddr(x => ({ ...x, city: e.target.value }))} style={inputStyle} />
                    </div>
                    <input placeholder={getCountry(addr.country)?.pincodePlaceholder ?? 'Postal code'} value={addr.pin} onChange={e => setAddr(x => ({ ...x, pin: e.target.value }))} maxLength={getCountry(addr.country)?.pincodeMaxLen ?? 12} style={inputStyle} />
                  </div>
                  {addrErr && <p style={{ fontSize:13, color:'#C0392B', marginTop:10 }}>{addrErr}</p>}
                  <div style={{ display:'flex', gap:10, marginTop:14 }}>
                    <button onClick={saveAddress} disabled={addrBusy} style={{ ...primaryBtn, opacity: addrBusy ? 0.5 : 1 }}>{addrBusy ? 'Saving…' : 'Save address'}</button>
                    <button onClick={() => setAddrOpen(false)} style={ghostBtn}>Cancel</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── OTP verification modal ── */}
      {otpModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(33,28,23,0.45)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'var(--paper)', borderRadius:4, padding:'30px 28px', maxWidth:400, width:'100%', animation:'glyaFade 0.3s ease' }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26 }}>Verify it&apos;s you</div>
            <p style={{ fontSize:13.5, color:'var(--ink2)', marginTop:8, lineHeight:1.7 }}>
              We&apos;ve sent a 6-digit code to <b>{otpModal.sentTo}</b>{otpModal.kind === 'email' ? ' (your current email) to confirm the change.' : '.'}
            </p>
            <input
              value={otpVal}
              onChange={e => setOtpVal(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="••••••"
              inputMode="numeric"
              autoFocus
              style={{ ...inputStyle, marginTop:16, textAlign:'center', fontSize:22, letterSpacing:'0.4em' }}
            />
            {otpErr && <p style={{ fontSize:13, color: otpErr.startsWith('A new code') ? 'var(--em)' : '#C0392B', marginTop:10 }}>{otpErr}</p>}
            <div style={{ display:'flex', gap:10, marginTop:16 }}>
              <button onClick={confirmOtp} disabled={otpBusy || otpVal.length !== 6} style={{ ...primaryBtn, flex:1, opacity: (otpBusy || otpVal.length !== 6) ? 0.5 : 1 }}>{otpBusy ? 'Verifying…' : 'Verify'}</button>
              <button onClick={() => setOtpModal(null)} style={ghostBtn}>Cancel</button>
            </div>
            <button onClick={resendOtp} disabled={otpBusy} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12.5, color:'var(--gold-d)', textDecoration:'underline', padding:0, marginTop:14 }}>Resend code</button>
          </div>
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
