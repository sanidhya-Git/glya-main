'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useStore, Order, OrderLine } from '@/lib/store';
import { catalog, priceOf, inr } from '@/lib/catalog';
import { createAdminOrder } from '@/lib/api';

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

export default function CheckoutPage() {
  const { cart, giftWrap, insurance, couponApplied, clearCart, setLastOrder, addOrder, decrementStock } = useStore();
  const goldRate      = useStore(s => s.goldRate);
  const adminProducts = useStore(s => s.adminProducts);
  const allProducts   = adminProducts.length > 0 ? adminProducts : catalog;
  const [step,      setStep]      = useState(1);
  const [shipIdx,   setShipIdx]   = useState(0);
  const [payMethod, setPayMethod] = useState(0);
  const [placed,    setPlaced]    = useState(false);
  const [orderNo,   setOrderNo]   = useState('');
  const [capturedTotal, setCapturedTotal] = useState(0);
  const [form, setForm] = useState({ first:'', last:'', email:'', mobile:'', addr1:'', addr2:'', pin:'', city:'', state:'' });

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

  const subtotal  = items.reduce((a, b) => a + b.lineNum, 0);
  let   discount  = 0;
  if (couponApplied && !couponApplied.invalid) {
    if (couponApplied.type === 'pct') discount = Math.min(Math.round(subtotal * 0.10), 25000);
    else                               discount = Math.min(couponApplied.amount || 0, subtotal);
  }
  const shipCost  = shipOptions[shipIdx].cost;
  const wrapCost  = giftWrap    ? 299 : 0;
  const insCost   = insurance   ? 499 : 0;
  const total     = subtotal - discount + shipCost + wrapCost + insCost;

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

    // Persist order to admin MongoDB
    const addrStr = [form.addr1, form.addr2, form.city, form.state, form.pin].filter(Boolean).join(', ');
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
            Your order <b>{orderNo}</b> is confirmed. A certificate of authenticity and GST invoice are on their way to your inbox.
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

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(18px,3vw,48px) clamp(14px,3vw,28px)', animation: 'glyaFade 0.5s ease' }}>
      <style>{`
        .co-name-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:14px; }
        .co-addr-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(110px,1fr)); gap:14px; }
        .co-layout { display:grid; grid-template-columns:repeat(auto-fit,minmax(290px,1fr)); gap:clamp(22px,4vw,48px); align-items:start; }
        .co-summary { background:var(--paper2); border-radius:4px; padding:clamp(18px,3vw,26px); position:sticky; top:80px; }
        @media (max-width:640px){ .co-summary { position:static; } }
      `}</style>
      <Link href="/cart" style={{ fontSize: 12.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', display: 'inline-block', marginBottom: 8 }}>← Back to bag</Link>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(28px,4vw,48px)' }}>Checkout</h1>

      <div style={{ display: 'flex', gap: 6, margin: '22px 0 28px', flexWrap: 'wrap' }}>
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
          {step === 1 && (
            <div style={{ display: 'grid', gap: 13 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26 }}>Delivery address</div>
              <div className="co-name-grid">
                <input placeholder="First name"  value={form.first}  onChange={e => setForm(f => ({ ...f, first:  e.target.value }))} style={{ border: '1px solid var(--line)', background: 'var(--paper)', padding: '13px 14px', fontSize: 14, borderRadius: 2 }} />
                <input placeholder="Last name"   value={form.last}   onChange={e => setForm(f => ({ ...f, last:   e.target.value }))} style={{ border: '1px solid var(--line)', background: 'var(--paper)', padding: '13px 14px', fontSize: 14, borderRadius: 2 }} />
              </div>
              <input type="email" placeholder="Email address" value={form.email}  onChange={e => setForm(f => ({ ...f, email:  e.target.value }))} style={{ border: '1px solid var(--line)', background: 'var(--paper)', padding: '13px 14px', fontSize: 14, borderRadius: 2 }} />
              <input placeholder="Mobile number"             value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} style={{ border: '1px solid var(--line)', background: 'var(--paper)', padding: '13px 14px', fontSize: 14, borderRadius: 2 }} />
              <input placeholder="Flat, house no., building" value={form.addr1}  onChange={e => setForm(f => ({ ...f, addr1:  e.target.value }))} style={{ border: '1px solid var(--line)', background: 'var(--paper)', padding: '13px 14px', fontSize: 14, borderRadius: 2 }} />
              <input placeholder="Area, street, locality"   value={form.addr2}  onChange={e => setForm(f => ({ ...f, addr2:  e.target.value }))} style={{ border: '1px solid var(--line)', background: 'var(--paper)', padding: '13px 14px', fontSize: 14, borderRadius: 2 }} />
              <div className="co-addr-grid">
                <input placeholder="Pincode" value={form.pin}   onChange={e => setForm(f => ({ ...f, pin:   e.target.value }))} style={{ border: '1px solid var(--line)', background: 'var(--paper)', padding: '13px 14px', fontSize: 14, borderRadius: 2 }} />
                <input placeholder="City"    value={form.city}  onChange={e => setForm(f => ({ ...f, city:  e.target.value }))} style={{ border: '1px solid var(--line)', background: 'var(--paper)', padding: '13px 14px', fontSize: 14, borderRadius: 2 }} />
                <input placeholder="State"   value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} style={{ border: '1px solid var(--line)', background: 'var(--paper)', padding: '13px 14px', fontSize: 14, borderRadius: 2 }} />
              </div>
            </div>
          )}

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
              <div style={{ background: 'var(--paper2)', borderRadius: 3, padding: '16px 18px', fontSize: 14, color: 'var(--ink2)' }}>
                Delivering to {form.addr1 || 'your address'} · {shipOptions[shipIdx].label}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} style={{ cursor: 'pointer', background: 'transparent', border: '1px solid var(--ink)', color: 'var(--ink)', padding: '16px 28px', fontSize: 12.5, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: 2 }}>Back</button>
            )}
            <button onClick={step === 4 ? placeOrder : () => setStep(s => s + 1)}
              style={{ cursor: 'pointer', flex: 1, background: 'var(--ink)', color: '#F7F2E8', border: 'none', padding: 16, fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', borderRadius: 2 }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-d)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--ink)')}
            >
              {step === 4 ? 'Place order' : step === 1 ? 'Continue to delivery' : step === 2 ? 'Continue to payment' : 'Review order'}
            </button>
          </div>
        </div>

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
