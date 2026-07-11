'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore, useMetalRates, Order, OrderLine } from '@/lib/store';
import { priceOf, inr, karatLabel } from '@/lib/catalog';
import { createAdminOrder, fetchUserProfile, postProfileAction, type SavedAddress } from '@/lib/api';
import { COUNTRIES, getCountry, validatePincode } from '@/lib/geo';

const shipOptions = [
  { label: 'Insured standard',  desc: '3–5 business days', cost: 0 },
];
const payMethods = [
  { icon: '💳', label: 'Credit / Debit card', desc: 'Visa, Mastercard, Amex' },
  { icon: '📱', label: 'UPI',                  desc: 'GPay, PhonePe, Paytm' },
  { icon: '🏦', label: 'Net banking',           desc: 'All major banks' },
];

const inputStyle: React.CSSProperties = {
  border: '1px solid var(--line)', background: 'var(--paper)',
  padding: '13px 14px', fontSize: 14, borderRadius: 2, width: '100%',
};
const selectStyle: React.CSSProperties = {
  border: '1px solid var(--line)', background: 'var(--paper)',
  padding: '13px 14px', fontSize: 14, borderRadius: 2, width: '100%',
  appearance: 'none', cursor: 'pointer',
};

export default function CheckoutPage() {
  const { cart, giftWrap, insurance, couponApplied, clearCoupon, clearCart, setLastOrder, addOrder, decrementStock } = useStore();
  const rates         = useMetalRates();
  const adminProducts = useStore(s => s.adminProducts);
  const user           = useStore(s => s.user);
  const setUser        = useStore(s => s.setUser);
  const productsLoaded = useStore(s => s.productsLoaded);

  /* ── Checkout state ── */
  const [shipIdx,   setShipIdx]   = useState(0);
  const [payMethod, setPayMethod] = useState(0);
  const [placed,    setPlaced]    = useState(false);
  const [placing,   setPlacing]   = useState(false);
  const [orderErr,  setOrderErr]  = useState('');
  const [orderNo,   setOrderNo]   = useState('');
  const [capturedTotal, setCapturedTotal] = useState(0);

  const [form, setForm] = useState({
    first: '', last: '', email: '',
    mobile: '', addr1: '', addr2: '',
    country: 'IN', state: '', city: '', pin: '',
  });

  /* ── Saved addresses (returning customers) ── */
  const [savedAddrs, setSavedAddrs] = useState<SavedAddress[]>([]);
  const [selAddrId,  setSelAddrId]  = useState<string>('new');

  const applySaved = (a: SavedAddress) => {
    const code = a.countryCode || COUNTRIES.find(c => c.name === a.country)?.code || 'IN';
    setForm(f => ({
      ...f,
      first: a.firstName || '', last: a.lastName || '', mobile: a.mobile || '',
      addr1: a.line1 || '', addr2: a.line2 || '',
      country: code, state: a.state || '', city: a.city || '', pin: a.pincode || '',
    }));
  };

  /* Pre-fill email + profile details when user is already logged in,
     and load the address book so nothing has to be retyped. */
  useEffect(() => {
    if (!user?.email) { setSavedAddrs([]); setSelAddrId('new'); return; }
    const email = user.email;
    setForm(f => ({ ...f, email: f.email || email }));
    const formWasEmpty = !form.addr1;
    let alive = true;
    fetchUserProfile(email).then(p => {
      if (!alive || !p) return;
      const list = (p.addresses ?? []).filter(a => a.line1);
      setSavedAddrs(list);
      const parts = (p.name ?? '').trim().split(/\s+/).filter(Boolean);
      setForm(f => ({
        ...f,
        first:  f.first  || parts[0] || '',
        last:   f.last   || parts.slice(1).join(' '),
        mobile: f.mobile || p.phone || '',
      }));
      const def = list.find(a => a.def) ?? list[0];
      if (def?._id && formWasEmpty) { setSelAddrId(def._id); applySaved(def); }
    });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  async function deleteSaved(a: SavedAddress) {
    if (!user?.email || !a._id) return;
    if (!window.confirm('Remove this saved address?')) return;
    const res = await postProfileAction({ action: 'delete-address', email: user.email, addressId: a._id });
    if (res.ok && res.profile) {
      setSavedAddrs((res.profile.addresses ?? []).filter(x => x.line1));
      if (selAddrId === a._id) {
        setSelAddrId('new');
        setForm(f => ({ ...f, addr1: '', addr2: '', state: '', city: '', pin: '' }));
      }
    }
  }

  const countryInfo = getCountry(form.country);
  const pincodeValid  = form.pin.length > 0 && validatePincode(form.pin, form.country);
  const pincodeError  = form.pin.length > 0 && !pincodeValid;

  /* ── Cart totals ── */
  /* Items whose product no longer exists in the admin catalog are excluded from totals. */
  const rawItems = cart.map(it => {
    const p = adminProducts.find(x => x.id === it.id);
    if (!p) return null;
    const pr = priceOf(p, it.karat, rates);
    return {
      ...it, p,
      lineStr:    inr(pr.total * it.qty),
      lineNum:    pr.total * it.qty,
      unitPrice:  pr.total,
      metalLabel: karatLabel(it.karat),
    };
  });
  const items = rawItems.filter(Boolean) as NonNullable<typeof rawItems[0]>[];

  const subtotal = items.reduce((a, b) => a + b.lineNum, 0);
  let   discount = 0;
  if (couponApplied && !couponApplied.invalid) {
    discount = Math.min(couponApplied.discount ?? 0, subtotal);
  }
  const shipCost = shipOptions[shipIdx].cost;
  const wrapCost = giftWrap    ? 299 : 0;
  const insCost  = insurance   ? 499 : 0;
  const total    = subtotal - discount + shipCost + wrapCost + insCost;

  /* ── Address step validation ── */
  function addressComplete() {
    if (!form.first || !form.last || !form.email || !form.mobile) return false;
    if (!form.addr1 || !form.city || !form.country) return false;
    if (countryInfo && countryInfo.states.length > 0 && !form.state) return false;
    if (form.pin && pincodeError) return false;
    return true;
  }

  /* ── Place order ── */
  async function placeOrder() {
    if (placing) return;
    setPlacing(true);
    setOrderErr('');
    const no = 'GLY' + Math.floor(700000 + Math.random() * 99999);
    const lines: OrderLine[] = items.map(it => ({
      productId: it.p.id,
      name:      it.p.name,
      karat:     it.karat,
      metal:     it.p.metal,
      size:      it.size,
      engraving: it.engraving,
      qty:       it.qty,
      unitPrice: it.unitPrice,
    }));
    const order: Order = {
      orderNo:       no,
      date:          new Date().toISOString(),
      lines,
      subtotal,
      discount,
      deliveryCost:  shipCost,
      giftWrapCost:  wrapCost,
      insuranceCost: insCost,
      total,
      couponCode:    couponApplied?.code || '',
      address: {
        firstName: form.first,
        lastName:  form.last,
        mobile:    form.mobile,
        line1:     form.addr1,
        line2:     form.addr2,
        pincode:   form.pin,
        city:      form.city,
        state:     form.state,
        country:   countryInfo?.name || form.country,
      },
      deliveryMethod: shipOptions[shipIdx].label,
      payment:        payMethods[payMethod].label,
      status:         'Confirmed',
    };
    const addrStr = [form.addr1, form.addr2, form.city, form.state, countryInfo?.name, form.pin].filter(Boolean).join(', ');
    const hasPromo = Boolean(couponApplied && !couponApplied.invalid && discount > 0);
    const result = await createAdminOrder({
      no,
      customer:    `${form.first} ${form.last}`.trim() || 'Guest',
      email:       form.email,
      items:       lines.length,
      total:       inr(total),
      totalNum:    total,
      payment:     payMethods[payMethod].label,
      status:      'Confirmed',
      date:        new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      isoDate:     new Date().toISOString(),
      address:     addrStr,
      /* Structured copy — saved into the customer's address book by the admin */
      addressObj: {
        label:       'Home',
        firstName:   form.first,
        lastName:    form.last,
        mobile:      form.mobile,
        line1:       form.addr1,
        line2:       form.addr2,
        city:        form.city,
        state:       form.state,
        country:     countryInfo?.name || form.country,
        countryCode: form.country,
        pincode:     form.pin,
      },
      lines:       items.map(it => ({
        name:     it.p.name,
        meta:     `${it.metalLabel}${it.size ? ' · Size ' + it.size : ''}`,
        qty:      it.qty,
        priceStr: it.lineStr,
      })),
      subtotalStr:  inr(subtotal),
      discountStr:  discount > 0 ? inr(discount) : '₹0',
      shippingStr:  shipCost === 0 ? 'Free' : inr(shipCost),
      ...(hasPromo ? {
        promoCode:     couponApplied!.code,
        promoDiscount: discount,
        subtotalNum:   total + discount,
      } : {}),
    });

    /* Promo went invalid between apply and checkout — server rejected the order. */
    if (result.promoError) {
      clearCoupon();
      setOrderErr(`${result.promoError} The code has been removed — please review your total and try again.`);
      setPlacing(false);
      return;
    }

    addOrder(order);
    decrementStock(lines);
    setCapturedTotal(total);
    setOrderNo(no);
    setLastOrder(no);
    clearCart();
    setPlaced(true);
    setPlacing(false);

    /* Auto-create the account from the order details — no OTP or verification. */
    if (!user) setUser({ email: form.email });

    /* Fire-and-forget: full invoice to the email the customer provided. */
    const eta = new Date();
    eta.setDate(eta.getDate() + (shipIdx === 0 ? 5 : shipIdx === 1 ? 2 : 1));
    const viewOrderUrl = `${window.location.origin}/track?order=${encodeURIComponent(no)}`;
    fetch('/api/send-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email:        form.email,
        name:         `${form.first} ${form.last}`.trim(),
        orderNo:      no,
        date:         new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        etaDate:      eta.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' }),
        address:      addrStr,
        payment:      payMethods[payMethod].label,
        delivery:     shipOptions[shipIdx].label,
        lines:        items.map(it => ({
          name:     it.p.name,
          meta:     `${it.metalLabel}${it.size ? ' · Size ' + it.size : ''}${it.engraving ? ' · Engraved' : ''}`,
          qty:      it.qty,
          priceStr: it.lineStr,
        })),
        subtotalStr:  inr(subtotal),
        discountStr:  discount > 0 ? inr(discount) : '',
        promoCode:    hasPromo ? couponApplied!.code : '',
        shippingStr:  shipCost === 0 ? 'Free' : inr(shipCost),
        giftWrapStr:  wrapCost > 0 ? inr(wrapCost) : '',
        insuranceStr: insCost > 0 ? inr(insCost) : '',
        totalStr:     inr(total),
        viewOrderUrl,
      }),
    }).catch(() => {});
  }

  /* ════════════════════════════════
     ORDER PLACED
  ════════════════════════════════ */
  if (placed) {
    const eta = new Date();
    eta.setDate(eta.getDate() + (shipIdx === 0 ? 5 : shipIdx === 1 ? 2 : 1));
    const etaDate = eta.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return (
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px,3vw,48px) 28px', animation: 'glyaFade 0.5s ease' }}>
        <div style={{ textAlign: 'center', padding: '70px 20px', maxWidth: 560, margin: '0 auto' }}>
          <div style={{ width: 76, height: 76, borderRadius: '50%', border: '1.5px solid var(--em)', color: 'var(--em)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, margin: '0 auto' }}>✓</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(32px,4vw,48px)', marginTop: 24 }}>Thank you.</h1>
          <p style={{ color: 'var(--ink2)', fontSize: 16, marginTop: 12, lineHeight: 1.7 }}>
            Your order <b>{orderNo}</b> is confirmed. A certificate of authenticity and GST invoice are on their way to {form.email}.
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 10, lineHeight: 1.7 }}>
            We&apos;ve created your GLYA account with this email — find this order any time under <Link href="/account" style={{ color: 'var(--gold-d)' }}>Account</Link>.
          </p>
          <div style={{ background: 'var(--paper2)', borderRadius: 4, padding: 22, marginTop: 28, textAlign: 'left', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div><div style={{ fontSize: 11.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>Total paid</div><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26 }}>{inr(capturedTotal)}</div></div>
            <div><div style={{ fontSize: 11.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>Estimated delivery</div><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26 }}>{etaDate}</div></div>
            <div><div style={{ fontSize: 11.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>Tracking</div><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26 }}>Live SMS</div></div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
            <Link href={`/track?order=${orderNo}`} style={{ background: 'var(--ink)', color: '#F7F2E8', padding: '15px 32px', fontSize: 12.5, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: 2, textDecoration: 'none' }}>Track your order</Link>
            <Link href="/" style={{ background: 'transparent', border: '1px solid var(--ink)', color: 'var(--ink)', padding: '15px 32px', fontSize: 12.5, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: 2, textDecoration: 'none' }}>Continue shopping</Link>
          </div>
        </div>
      </main>
    );
  }

  /* ════════════════════════════════
     LOADING — products not yet fetched
  ════════════════════════════════ */
  if (!productsLoaded && cart.length > 0) {
    return (
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px,3vw,48px) clamp(14px,3vw,28px)', animation: 'glyaFade 0.5s ease' }}>
        <Link href="/cart" style={{ fontSize: 12.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none' }}>← Back to bag</Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(28px,4vw,48px)', marginTop: 8 }}>Checkout</h1>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 40, color: 'var(--gold)', animation: 'glyaFade 1.2s ease infinite alternate' }}>◈</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, marginTop: 14 }}>Preparing your order</div>
          <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: 14 }}>Fetching your pieces…</p>
        </div>
      </main>
    );
  }

  /* ════════════════════════════════
     MAIN CHECKOUT
  ════════════════════════════════ */
  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(18px,3vw,48px) clamp(14px,3vw,28px)', animation: 'glyaFade 0.5s ease' }}>
      <style>{`
        .co-name-grid  { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:14px; }
        .co-addr-grid  { display:grid; grid-template-columns:repeat(auto-fit,minmax(110px,1fr)); gap:14px; }
        .co-geo-grid   { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        @media(max-width:480px){ .co-geo-grid { grid-template-columns:1fr; } }
        .co-layout     { display:grid; grid-template-columns:repeat(auto-fit,minmax(290px,1fr)); gap:clamp(22px,4vw,48px); align-items:start; }
        .co-summary    { background:var(--paper2); border-radius:4px; padding:clamp(18px,3vw,26px); position:sticky; top:80px; }
        @media(max-width:640px){ .co-summary { position:static; } }
        .co-select-wrap { position:relative; }
        .co-select-wrap::after { content:'▾'; position:absolute; right:14px; top:50%; transform:translateY(-50%); pointer-events:none; color:var(--muted); font-size:12px; }
      `}</style>

      {/* Logged-in indicator (guests check out without an account) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
        <Link href="/cart" style={{ fontSize: 12.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none' }}>← Back to bag</Link>
        {user ? (
          <div style={{ fontSize: 12.5, color: 'var(--em)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--em)', display: 'inline-block' }}></span>
            {user.email}
            <button onClick={() => setUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 12, textDecoration: 'underline', padding: 0 }}>Sign out</button>
          </div>
        ) : (
          <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Checking out as guest</div>
        )}
      </div>

      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(28px,4vw,48px)', marginBottom: 8 }}>Checkout</h1>

      <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: '4px 0 26px' }}>Fill in your details below and pay in one step — no account needed.</p>

      <div className="co-layout">
        <div>
          {/* ── Address ── */}
          <div style={{ display: 'grid', gap: 13 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26 }}>Delivery address</div>

              {/* Saved addresses — returning customers pick one instead of retyping */}
              {savedAddrs.length > 0 && (
                <div style={{ display: 'grid', gap: 10 }}>
                  {savedAddrs.map(a => (
                    <div key={a._id} onClick={() => { setSelAddrId(a._id!); applySaved(a); }} style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'flex-start', border: `1px solid ${selAddrId === a._id ? 'var(--gold)' : 'var(--line)'}`, background: selAddrId === a._id ? 'rgba(176,141,87,0.04)' : 'transparent', borderRadius: 3, padding: '14px 16px' }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                        {selAddrId === a._id && <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--ink)' }}></span>}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14.5 }}>
                          {a.firstName} {a.lastName}
                          {a.def && <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-d)', border: '1px solid var(--gold)', borderRadius: 2, padding: '2px 7px', marginLeft: 8, verticalAlign: 'middle' }}>Default</span>}
                        </div>
                        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3, lineHeight: 1.6 }}>
                          {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}{a.state ? `, ${a.state}` : ''}{a.pincode ? ` – ${a.pincode}` : ''}<br />{a.mobile}
                        </div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); deleteSaved(a); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#B4553B', textDecoration: 'underline', padding: 0, flexShrink: 0 }}>Delete</button>
                    </div>
                  ))}
                  <div onClick={() => setSelAddrId('new')} style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center', border: `1px solid ${selAddrId === 'new' ? 'var(--gold)' : 'var(--line)'}`, borderRadius: 3, padding: '14px 16px' }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {selAddrId === 'new' && <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--ink)' }}></span>}
                    </span>
                    <div style={{ fontSize: 14.5 }}>Deliver to a new address</div>
                  </div>
                </div>
              )}

              {(savedAddrs.length === 0 || selAddrId === 'new') && (<>
              <div className="co-name-grid">
                <input placeholder="First name" value={form.first} onChange={e => setForm(f => ({ ...f, first: e.target.value }))} style={inputStyle} />
                <input placeholder="Last name"  value={form.last}  onChange={e => setForm(f => ({ ...f, last:  e.target.value }))} style={inputStyle} />
              </div>

              <input type="email" placeholder="Email address" value={form.email}  onChange={e => setForm(f => ({ ...f, email:  e.target.value }))} style={inputStyle} />
              <input placeholder="Mobile number"             value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} style={inputStyle} />
              <input placeholder="Flat, house no., building" value={form.addr1}  onChange={e => setForm(f => ({ ...f, addr1:  e.target.value }))} style={inputStyle} />
              <input placeholder="Area, street, locality"   value={form.addr2}  onChange={e => setForm(f => ({ ...f, addr2:  e.target.value }))} style={inputStyle} />

              {/* Country */}
              <div>
                <div style={{ fontSize: 11.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 7 }}>Country</div>
                <div className="co-select-wrap">
                  <select
                    value={form.country}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value, state: '', pin: '' }))}
                    style={selectStyle}
                  >
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* State / Region */}
              <div className="co-geo-grid">
                <div>
                  <div style={{ fontSize: 11.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 7 }}>
                    {countryInfo && countryInfo.states.length > 0 ? 'State / Province' : 'State / Region'}
                  </div>
                  {countryInfo && countryInfo.states.length > 0 ? (
                    <div className="co-select-wrap">
                      <select
                        value={form.state}
                        onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                        style={selectStyle}
                      >
                        <option value="">Select state</option>
                        {countryInfo.states.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  ) : (
                    <input placeholder="State / Region" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} style={inputStyle} />
                  )}
                </div>

                <div>
                  <div style={{ fontSize: 11.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 7 }}>City</div>
                  <input placeholder="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} style={inputStyle} />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <div style={{ fontSize: 11.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 7 }}>
                  {countryInfo?.pincodeLabel ?? 'Postal Code'}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    placeholder={countryInfo?.pincodePlaceholder ?? 'Postal code'}
                    value={form.pin}
                    onChange={e => setForm(f => ({ ...f, pin: e.target.value }))}
                    maxLength={countryInfo?.pincodeMaxLen ?? 12}
                    style={{ ...inputStyle, borderColor: pincodeError ? '#C0392B' : pincodeValid ? 'var(--em)' : 'var(--line)' }}
                  />
                  {pincodeValid  && <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--em)', fontSize: 15 }}>✓</span>}
                  {pincodeError  && <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#C0392B', fontSize: 15 }}>✗</span>}
                </div>
                {pincodeError && (
                  <div style={{ fontSize: 12.5, color: '#C0392B', marginTop: 5 }}>
                    Invalid {countryInfo?.pincodeLabel ?? 'postal code'} for {countryInfo?.name ?? 'selected country'}
                  </div>
                )}
              </div>
              </>)}
          </div>

          {/* ── Delivery ── */}
          <div style={{ display: 'grid', gap: 14, marginTop: 36 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26 }}>Delivery method</div>
              {shipOptions.map((o, i) => (
                <div key={i} onClick={() => setShipIdx(i)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, border: `1px solid ${shipIdx === i ? 'var(--gold)' : 'var(--line)'}`, borderRadius: 3, padding: '18px 20px' }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {shipIdx === i && <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--ink)' }}></span>}
                  </span>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 15 }}>{o.label}</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{o.desc}</div></div>
                  <div style={{ fontSize: 14, color: 'var(--em)' }}>{o.cost === 0 ? 'Free' : inr(o.cost)}</div>
                </div>
              ))}
          </div>

          {/* ── Payment ── */}
          <div style={{ display: 'grid', gap: 12, marginTop: 36 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26 }}>Payment method</div>
              {payMethods.map((p, i) => (
                <div key={i} onClick={() => setPayMethod(i)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, border: `1px solid ${payMethod === i ? 'var(--gold)' : 'var(--line)'}`, background: payMethod === i ? 'rgba(176,141,87,0.04)' : 'transparent', borderRadius: 3, padding: '16px 18px' }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {payMethod === i && <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--ink)' }}></span>}
                  </span>
                  <span style={{ fontSize: 20 }}>{p.icon}</span>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 15 }}>{p.label}</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{p.desc}</div></div>
                </div>
              ))}
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6 }}>🔒 Payments are encrypted and verified.</div>
          </div>

          {/* ── Pay now ── */}
          {orderErr && (
            <div style={{ marginTop: 24, padding: '13px 16px', background: 'rgba(192,57,43,0.06)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 3, fontSize: 13.5, color: '#C0392B', lineHeight: 1.6 }}>
              {orderErr}
            </div>
          )}
          <button
            onClick={placeOrder}
            disabled={!addressComplete() || placing}
            style={{ cursor: 'pointer', width: '100%', marginTop: orderErr ? 14 : 30, background: 'var(--ink)', color: '#F7F2E8', border: 'none', padding: 17, fontSize: 13.5, letterSpacing: '0.14em', textTransform: 'uppercase', borderRadius: 2, opacity: (!addressComplete() || placing) ? 0.5 : 1 }}
            onMouseEnter={e => { if (addressComplete() && !placing) (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold-d)'; }}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--ink)')}
          >
            {placing ? 'Processing…' : `Pay now · ${inr(total)}`}
          </button>
          {!addressComplete() && (
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 10, textAlign: 'center' }}>
              Fill in your name, email, mobile and address to continue
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="co-summary">
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, marginBottom: 16 }}>Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--line)' }}>
            {items.map((it, i) => {
              const img = it.p.images?.[0];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0, borderRadius: 3, overflow: 'hidden', background: 'var(--line)' }}>
                    {img && <Image src={img} alt={it.p.name} fill sizes="52px" style={{ objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{it.metalLabel}{it.size ? ` · Size ${it.size}` : ''} · Qty {it.qty}</div>
                  </div>
                  <div style={{ fontSize: 13.5, whiteSpace: 'nowrap' }}>{it.lineStr}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink2)' }}><span>Subtotal ({items.reduce((a, b) => a + b.qty, 0)})</span><span>{inr(subtotal)}</span></div>
            {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--em)' }}><span>Discount ({couponApplied?.code})</span><span>− {inr(discount)}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink2)' }}><span>Delivery</span><span style={{ color: 'var(--em)' }}>{shipCost === 0 ? 'Free' : inr(shipCost)}</span></div>
            {giftWrap    && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink2)' }}><span>Gift wrapping</span><span>{inr(299)}</span></div>}
            {insurance   && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink2)' }}><span>Shipment insurance</span><span>{inr(499)}</span></div>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--line)', marginTop: 16, paddingTop: 16 }}>
            <span style={{ fontSize: 15 }}>Total</span>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 500 }}>{inr(total)}</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 6 }}>Inclusive of all taxes</div>
        </div>
      </div>
    </main>
  );
}
