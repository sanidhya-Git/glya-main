'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore, Order, OrderLine } from '@/lib/store';
import { catalog, priceOf, inr } from '@/lib/catalog';
import { createAdminOrder } from '@/lib/api';
import { COUNTRIES, getCountry, validatePincode } from '@/lib/geo';

const steps = ['Address', 'Delivery', 'Payment', 'Review'];
const shipOptions = [
  { label: 'Insured standard',  desc: '3–5 business days', cost: 0 },
  { label: 'Insured express',   desc: '1–2 business days', cost: 299 },
  { label: 'Insured same-day',  desc: 'Select cities only', cost: 499 },
];
const payMethods = [
  { icon: '💳', label: 'Credit / Debit card', desc: 'Visa, Mastercard, Amex' },
  { icon: '📱', label: 'UPI',                  desc: 'GPay, PhonePe, Paytm' },
  { icon: '🏦', label: 'Net banking',           desc: 'All major banks' },
  { icon: '📦', label: 'Cash on delivery',      desc: 'Select pincodes' },
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
  const { cart, giftWrap, insurance, couponApplied, clearCart, setLastOrder, addOrder, decrementStock } = useStore();
  const goldRate      = useStore(s => s.goldRate);
  const adminProducts = useStore(s => s.adminProducts);
  const user          = useStore(s => s.user);
  const setUser       = useStore(s => s.setUser);
  const allProducts   = adminProducts.length > 0 ? adminProducts : catalog;

  /* ── Auth state ── */
  const [authEmail,   setAuthEmail]   = useState('');
  const [otpSent,     setOtpSent]     = useState(false);
  const [generatedOtp,setGeneratedOtp]= useState('');
  const [enteredOtp,  setEnteredOtp]  = useState('');
  const [otpErr,      setOtpErr]      = useState('');

  /* ── Checkout state ── */
  const [step,      setStep]      = useState(1);
  const [shipIdx,   setShipIdx]   = useState(0);
  const [payMethod, setPayMethod] = useState(0);
  const [placed,    setPlaced]    = useState(false);
  const [orderNo,   setOrderNo]   = useState('');
  const [capturedTotal, setCapturedTotal] = useState(0);

  const [form, setForm] = useState({
    first: '', last: '', email: '',
    mobile: '', addr1: '', addr2: '',
    country: 'IN', state: '', city: '', pin: '',
  });

  /* Pre-fill email when user is already logged in */
  useEffect(() => {
    if (user?.email) setForm(f => ({ ...f, email: f.email || user.email }));
  }, [user?.email]);

  const countryInfo = getCountry(form.country);
  const pincodeValid  = form.pin.length > 0 && validatePincode(form.pin, form.country);
  const pincodeError  = form.pin.length > 0 && !pincodeValid;

  /* ── Cart totals ── */
  const items = cart.map(it => {
    const p  = allProducts.find(x => x.id === it.id) || catalog.find(x => x.id === it.id)!;
    const pr = priceOf(p, it.karat, goldRate);
    return {
      ...it, p,
      lineStr:    inr(pr.total * it.qty),
      lineNum:    pr.total * it.qty,
      unitPrice:  pr.total,
      metalLabel: it.karat === 'PT950' ? 'Platinum 950' : it.karat + ' Gold',
    };
  }).filter(it => it.p);

  const subtotal = items.reduce((a, b) => a + b.lineNum, 0);
  let   discount = 0;
  if (couponApplied && !couponApplied.invalid) {
    if (couponApplied.type === 'pct') discount = Math.min(Math.round(subtotal * 0.10), 25000);
    else                               discount = Math.min(couponApplied.amount || 0, subtotal);
  }
  const shipCost = shipOptions[shipIdx].cost;
  const wrapCost = giftWrap    ? 299 : 0;
  const insCost  = insurance   ? 499 : 0;
  const total    = subtotal - discount + shipCost + wrapCost + insCost;

  /* ── OTP handlers ── */
  function handleSendOtp() {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpErr('');
    setEnteredOtp('');
    console.log(`[GLYA OTP] ${code} → ${authEmail}`);
  }

  function handleVerifyOtp() {
    if (enteredOtp === generatedOtp) {
      setUser({ email: authEmail });
      setForm(f => ({ ...f, email: authEmail }));
      setOtpErr('');
    } else {
      setOtpErr('Invalid OTP. Please try again.');
    }
  }

  /* ── Address step validation ── */
  function addressComplete() {
    if (!form.first || !form.last || !form.email || !form.mobile) return false;
    if (!form.addr1 || !form.city || !form.country) return false;
    if (countryInfo && countryInfo.states.length > 0 && !form.state) return false;
    if (form.pin && pincodeError) return false;
    return true;
  }

  /* ── Place order ── */
  function placeOrder() {
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
    addOrder(order);
    decrementStock(lines);
    setCapturedTotal(total);
    setOrderNo(no);
    setLastOrder(no);
    clearCart();
    setPlaced(true);

    const addrStr = [form.addr1, form.addr2, form.city, form.state, countryInfo?.name, form.pin].filter(Boolean).join(', ');
    createAdminOrder({
      no,
      customer:    `${form.first} ${form.last}`.trim() || 'Guest',
      email:       form.email,
      items:       lines.length,
      total:       inr(total),
      totalNum:    total,
      payment:     payMethods[payMethod].label,
      status:      'Confirmed',
      date:        new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      address:     addrStr,
      lines:       items.map(it => ({
        name:     it.p.name,
        meta:     `${it.metalLabel}${it.size ? ' · Size ' + it.size : ''}`,
        qty:      it.qty,
        priceStr: it.lineStr,
      })),
      subtotalStr:  inr(subtotal),
      discountStr:  discount > 0 ? inr(discount) : '₹0',
      shippingStr:  shipCost === 0 ? 'Free' : inr(shipCost),
    });
  }

  /* ════════════════════════════════
     AUTH GATE — shown if not logged in
  ════════════════════════════════ */
  if (!user) {
    return (
      <main style={{ maxWidth: 480, margin: '0 auto', padding: 'clamp(40px,6vw,80px) clamp(20px,5vw,40px)', animation: 'glyaFade 0.5s ease' }}>
        <Link href="/cart" style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', display: 'inline-block', marginBottom: 28 }}>← Back to bag</Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(28px,4vw,42px)' }}>Verify your email</h1>
        <p style={{ color: 'var(--ink2)', fontSize: 14, marginTop: 10, marginBottom: 32, lineHeight: 1.75 }}>
          A verified email is required to place an order. We'll send your invoice and order updates to this address.
        </p>

        {!otpSent ? (
          <div style={{ display: 'grid', gap: 14 }}>
            <input
              type="email"
              placeholder="Email address"
              value={authEmail}
              onChange={e => setAuthEmail(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && authEmail.includes('@')) handleSendOtp(); }}
              style={inputStyle}
              autoFocus
            />
            <button
              onClick={handleSendOtp}
              disabled={!authEmail.includes('@') || authEmail.length < 5}
              style={{ cursor: 'pointer', background: 'var(--ink)', color: '#F7F2E8', border: 'none', padding: '16px', fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', borderRadius: 2, opacity: (!authEmail.includes('@') || authEmail.length < 5) ? 0.5 : 1 }}
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ padding: '14px 16px', background: 'rgba(47,74,63,0.08)', border: '1px solid rgba(47,74,63,0.2)', borderRadius: 3 }}>
              <div style={{ fontSize: 13.5, color: 'var(--em)' }}>OTP sent to <b>{authEmail}</b></div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6 }}>
                Demo mode — your OTP: <b style={{ letterSpacing: '0.2em', color: 'var(--ink)', fontSize: 15 }}>{generatedOtp}</b>
              </div>
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter 6-digit OTP"
              value={enteredOtp}
              onChange={e => { setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setOtpErr(''); }}
              onKeyDown={e => { if (e.key === 'Enter' && enteredOtp.length === 6) handleVerifyOtp(); }}
              maxLength={6}
              style={{ ...inputStyle, letterSpacing: '0.28em', fontSize: 18, textAlign: 'center' }}
              autoFocus
            />
            {otpErr && <div style={{ fontSize: 13, color: '#C0392B' }}>{otpErr}</div>}
            <button
              onClick={handleVerifyOtp}
              disabled={enteredOtp.length !== 6}
              style={{ cursor: 'pointer', background: 'var(--ink)', color: '#F7F2E8', border: 'none', padding: '16px', fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', borderRadius: 2, opacity: enteredOtp.length !== 6 ? 0.5 : 1 }}
            >
              Verify OTP
            </button>
            <button
              onClick={() => { setOtpSent(false); setEnteredOtp(''); setOtpErr(''); setGeneratedOtp(''); }}
              style={{ cursor: 'pointer', background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: 13, textDecoration: 'underline', padding: 0, textAlign: 'left' }}
            >
              ← Change email
            </button>
          </div>
        )}
      </main>
    );
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

      {/* Logged-in indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
        <Link href="/cart" style={{ fontSize: 12.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none' }}>← Back to bag</Link>
        <div style={{ fontSize: 12.5, color: 'var(--em)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--em)', display: 'inline-block' }}></span>
          {user.email}
          <button onClick={() => setUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 12, textDecoration: 'underline', padding: 0 }}>Sign out</button>
        </div>
      </div>

      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(28px,4vw,48px)', marginBottom: 8 }}>Checkout</h1>

      {/* Steps */}
      <div style={{ display: 'flex', gap: 6, margin: '16px 0 28px', flexWrap: 'wrap' }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 110 }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', border: `1.5px solid ${i + 1 === step ? 'var(--ink)' : i + 1 < step ? 'var(--gold)' : 'var(--line)'}`, background: i + 1 < step ? 'var(--gold)' : i + 1 === step ? 'var(--ink)' : 'transparent', color: i + 1 <= step ? '#fff' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>
              {i + 1 < step ? '✓' : i + 1}
            </span>
            <span style={{ fontSize: 11.5, letterSpacing: '0.07em', textTransform: 'uppercase', color: i + 1 === step ? 'var(--ink)' : 'var(--muted)', whiteSpace: 'nowrap' }}>{s}</span>
          </div>
        ))}
      </div>

      <div className="co-layout">
        <div>
          {/* ── STEP 1: Address ── */}
          {step === 1 && (
            <div style={{ display: 'grid', gap: 13 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26 }}>Delivery address</div>

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
            </div>
          )}

          {/* ── STEP 2: Delivery ── */}
          {step === 2 && (
            <div style={{ display: 'grid', gap: 14 }}>
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
          )}

          {/* ── STEP 3: Payment ── */}
          {step === 3 && (
            <div style={{ display: 'grid', gap: 12 }}>
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
          )}

          {/* ── STEP 4: Review ── */}
          {step === 4 && (
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26 }}>Review &amp; place order</div>
              {items.map(i => (
                <div key={i.key} style={{ display: 'flex', gap: 14, alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: 14 }}>
                  <div style={{ width: 60, height: 70, flexShrink: 0, background: 'var(--paper2)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'var(--line)' }}>◈</div>
                  <div style={{ flex: 1 }}><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18 }}>{i.p.name}</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{i.metalLabel} · Qty {i.qty}</div></div>
                  <div style={{ fontSize: 15 }}>{i.lineStr}</div>
                </div>
              ))}
              <div style={{ background: 'var(--paper2)', borderRadius: 3, padding: '16px 18px', fontSize: 14, color: 'var(--ink2)', lineHeight: 1.7 }}>
                <div>Delivering to {form.addr1 || 'your address'}, {form.city}{form.state ? ', ' + form.state : ''}, {countryInfo?.name}</div>
                <div style={{ marginTop: 4 }}>Via {shipOptions[shipIdx].label}</div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} style={{ cursor: 'pointer', background: 'transparent', border: '1px solid var(--ink)', color: 'var(--ink)', padding: '16px 28px', fontSize: 12.5, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: 2 }}>Back</button>
            )}
            <button
              onClick={step === 4 ? placeOrder : () => setStep(s => s + 1)}
              disabled={step === 1 && !addressComplete()}
              style={{ cursor: 'pointer', flex: 1, background: 'var(--ink)', color: '#F7F2E8', border: 'none', padding: 16, fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', borderRadius: 2, opacity: (step === 1 && !addressComplete()) ? 0.5 : 1 }}
              onMouseEnter={e => { if (!(step === 1 && !addressComplete())) (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold-d)'; }}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--ink)')}
            >
              {step === 4 ? 'Place order' : step === 1 ? 'Continue to delivery' : step === 2 ? 'Continue to payment' : 'Review order'}
            </button>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="co-summary">
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, marginBottom: 16 }}>Summary</div>
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
