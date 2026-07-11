'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { inr } from '@/lib/catalog';

const BASE = process.env.NEXT_PUBLIC_GLYA_API_BASE ?? process.env.NEXT_PUBLIC_ADMIN_API ?? 'http://localhost:3001';

const ALL_EVENTS = [
  { status: 'Confirmed',  label: 'Order confirmed',  sub: 'We have received your order and payment.' },
  { status: 'Processing', label: 'Order processing', sub: 'Your jewellery is being prepared.' },
  { status: 'Dispatched', label: 'Dispatched',        sub: 'Handed over to our insured courier.' },
  { status: 'In transit', label: 'In transit',        sub: 'Your order is on its way.' },
  { status: 'Delivered',  label: 'Delivered',         sub: 'Your order has been delivered. Enjoy.' },
];
const STATUS_ORDER = ['Confirmed', 'Processing', 'Dispatched', 'In transit', 'Delivered'];

function statusColor(s: string) {
  if (s === 'Delivered')  return '#2F7A5B';
  if (s === 'Cancelled')  return '#B4553B';
  if (s === 'In transit') return '#B08D57';
  return '#555';
}

function TrackForm() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      const v = (e.currentTarget.elements.namedItem('o') as HTMLInputElement).value.trim();
      if (v) window.location.href = `/track?order=${v}`;
    }} style={{ display: 'flex', gap: 10, marginTop: 20, maxWidth: 400 }}>
      <input name="o" placeholder="GLY…" style={{ flex: 1, border: '1px solid var(--line)', background: 'var(--paper)', padding: '13px 16px', fontSize: 14, borderRadius: 2 }} />
      <button type="submit" style={{ cursor: 'pointer', background: 'var(--ink)', color: '#F7F2E8', border: 'none', padding: '13px 24px', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 2 }}>Track</button>
    </form>
  );
}

function TrackInner() {
  const params  = useSearchParams();
  const orderNo = params.get('order') || '';
  const orders  = useStore(s => s.orders);
  const adminProducts = useStore(s => s.adminProducts);
  const order   = orders.find(o => o.orderNo === orderNo);

  const [adminOrder, setAdminOrder] = useState<{ no: string; status: string; payment: string; date: string; total: string; lines: { name: string; meta: string; qty: number; priceStr: string }[] } | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    if (!orderNo || order) return;
    setAdminLoading(true);
    fetch(`${BASE}/api/orders/${orderNo}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setAdminOrder(d); })
      .catch(() => null)
      .finally(() => setAdminLoading(false));
  }, [orderNo, order]);

  if (!orderNo) {
    return (
      <main style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(40px,5vw,80px) 28px' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(28px,4vw,44px)' }}>Track order</h1>
        <p style={{ color: 'var(--muted)', marginTop: 10, fontSize: 15 }}>Enter your order number to track your shipment.</p>
        <TrackForm />
      </main>
    );
  }

  if (!order && adminLoading) {
    return <main style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(40px,5vw,80px) 28px' }}><p style={{ color: 'var(--muted)', fontSize: 15 }}>Looking up order…</p></main>;
  }

  if (!order && adminOrder) {
    const idx = STATUS_ORDER.indexOf(adminOrder.status);
    return (
      <main style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(40px,5vw,80px) 28px', animation: 'glyaFade 0.5s ease' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(28px,4vw,44px)', marginBottom: 24 }}>Order {adminOrder.no}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <span style={{ fontSize: 13, padding: '4px 12px', borderRadius: 2, background: `${statusColor(adminOrder.status)}15`, color: statusColor(adminOrder.status) }}>{adminOrder.status}</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>{adminOrder.date}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 28 }}>
          {ALL_EVENTS.map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${i <= idx ? 'var(--gold)' : 'var(--line)'}`, background: i <= idx ? (i === idx ? 'var(--gold)' : 'var(--paper)') : 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: i <= idx ? (i === idx ? '#fff' : 'var(--gold)') : 'var(--line)', zIndex: 1 }}>{i <= idx ? '✓' : ''}</div>
                {i < ALL_EVENTS.length - 1 && <div style={{ width: 2, flex: 1, background: i <= idx ? 'var(--gold)' : 'var(--line)', minHeight: 36, opacity: 0.5 }}></div>}
              </div>
              <div style={{ paddingBottom: i < ALL_EVENTS.length - 1 ? 24 : 0 }}>
                <div style={{ fontSize: 14, fontWeight: i === idx ? 500 : 400, color: i <= idx ? 'var(--ink)' : 'var(--muted)' }}>{e.label}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{e.sub}</div>
              </div>
            </div>
          ))}
        </div>
        {adminOrder.lines.map((l, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14 }}>{l.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{l.meta} · Qty {l.qty}</div>
            </div>
            <div style={{ fontSize: 14 }}>{l.priceStr}</div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 15 }}>
          <span>Total</span>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22 }}>{adminOrder.total}</span>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(40px,5vw,80px) 28px' }}>
        <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 20 }}>No order found for <b>{orderNo}</b>.</p>
        <TrackForm />
      </main>
    );
  }

  const statusIdx = order.status === 'Cancelled' ? -1 : STATUS_ORDER.indexOf(order.status);
  const orderDate = new Date(order.date);
  const eta       = new Date(orderDate);
  eta.setDate(eta.getDate() + (order.deliveryMethod.includes('express') ? 2 : order.deliveryMethod.includes('same') ? 1 : 5));

  const timelineEvents = order.status === 'Cancelled'
    ? [{ label: 'Order cancelled', sub: 'Your order was cancelled.', done: true, active: true }]
    : ALL_EVENTS.map((e, i) => ({ ...e, done: i <= statusIdx, active: i === statusIdx }));

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(24px,3vw,48px) 28px', animation: 'glyaFade 0.5s ease' }}>
      <Link href="/account" style={{ fontSize: 12.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', display: 'inline-block', marginBottom: 8 }}>← My account</Link>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(28px,4vw,44px)' }}>Track order</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'clamp(20px,3vw,40px)', marginTop: 28 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22 }}>{order.orderNo}</div>
            <span style={{ fontSize: 12.5, padding: '4px 10px', borderRadius: 2, background: `${statusColor(order.status)}15`, color: statusColor(order.status) }}>{order.status}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {timelineEvents.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${e.done ? 'var(--gold)' : 'var(--line)'}`, background: e.done ? (e.active ? 'var(--gold)' : 'var(--paper)') : 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: e.done ? (e.active ? '#fff' : 'var(--gold)') : 'var(--line)', zIndex: 1 }}>
                    {e.done ? '✓' : ''}
                  </div>
                  {i < timelineEvents.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: e.done ? 'var(--gold)' : 'var(--line)', minHeight: 36, opacity: 0.5 }}></div>
                  )}
                </div>
                <div style={{ paddingBottom: i < timelineEvents.length - 1 ? 28 : 0 }}>
                  <div style={{ fontSize: 14, fontWeight: e.active ? 500 : 400, color: e.done ? 'var(--ink)' : 'var(--muted)' }}>{e.label}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3 }}>{e.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--paper2)', borderRadius: 3, padding: '20px 22px' }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, marginBottom: 14 }}>Delivery details</div>
            <div style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.8 }}>
              {order.address.firstName} {order.address.lastName}<br />
              {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''}<br />
              {order.address.city}, {order.address.state} – {order.address.pincode}<br />
              {order.address.mobile}
            </div>
            <div style={{ marginTop: 12, fontSize: 12.5, color: 'var(--muted)' }}>
              {order.deliveryMethod} · Est. {eta.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </div>
          </div>

          <div style={{ border: '1px solid var(--line)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', background: 'var(--paper2)', fontFamily: "'Cormorant Garamond',serif", fontSize: 20 }}>Items</div>
            {order.lines.map((l, i) => {
              const prod = adminProducts.find(p => p.id === l.productId) ??
                           adminProducts.find(p => p.name.toLowerCase() === l.name.toLowerCase());
              const img  = prod?.images?.[0];
              return (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 18px', borderTop: i === 0 ? 'none' : '1px solid var(--line)' }}>
                <div style={{ width: 46, height: 52, background: 'var(--paper2)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--line)', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                  {img ? <Image src={img} alt={l.name} fill sizes="46px" style={{ objectFit: 'contain' }} /> : '◈'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontFamily: "'Cormorant Garamond',serif" }}>{l.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{l.karat} {l.metal} · Qty {l.qty}</div>
                </div>
                <div style={{ fontSize: 14 }}>{inr(l.unitPrice * l.qty)}</div>
              </div>
              );
            })}
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
              <span>Total paid</span>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22 }}>{inr(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<main style={{ padding: '80px 28px', textAlign: 'center', color: 'var(--muted)' }}>Loading…</main>}>
      <TrackInner />
    </Suspense>
  );
}
