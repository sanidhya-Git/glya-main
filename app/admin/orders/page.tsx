'use client';
import { useState } from 'react';
import { useStore, OrderStatus } from '@/lib/store';
import { inr } from '@/lib/catalog';

const STATUSES: OrderStatus[] = ['Confirmed', 'Processing', 'Dispatched', 'In transit', 'Delivered', 'Cancelled'];
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Confirmed:    { bg: 'rgba(176,141,87,0.12)',  color: '#B08D57' },
  Processing:   { bg: 'rgba(176,141,87,0.12)',  color: '#B08D57' },
  Dispatched:   { bg: 'rgba(47,122,91,0.1)',    color: '#2F7A5B' },
  'In transit': { bg: 'rgba(47,122,91,0.1)',    color: '#2F7A5B' },
  Delivered:    { bg: 'rgba(47,122,91,0.15)',   color: '#2F7A5B' },
  Cancelled:    { bg: 'rgba(180,85,59,0.12)',   color: '#B4553B' },
};

export default function AdminOrdersPage() {
  const orders            = useStore(s => s.orders);
  const updateOrderStatus = useStore(s => s.updateOrderStatus);
  const [filter, setFilter]   = useState<string>('All');
  const [search, setSearch]   = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'All' || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || o.orderNo.toLowerCase().includes(q)
      || `${o.address.firstName} ${o.address.lastName}`.toLowerCase().includes(q)
      || o.address.mobile.includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(26px,3vw,38px)' }}>Orders</h1>
        <div style={{ fontSize: 13, color: 'var(--admin-muted)' }}>{orders.length} total</div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          placeholder="Search by order no, name, mobile…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, border: '1px solid var(--admin-border)', background: 'var(--admin-surface)', color: 'var(--admin-text)', padding: '10px 14px', fontSize: 13.5, borderRadius: 3 }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['All', ...STATUSES] as string[]).map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ cursor: 'pointer', padding: '8px 14px', fontSize: 12, letterSpacing: '0.08em', background: filter === s ? '#B08D57' : 'var(--admin-surface)', color: filter === s ? '#fff' : 'var(--admin-muted)', border: '1px solid var(--admin-border)', borderRadius: 3 }}>{s}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--admin-muted)', fontSize: 15 }}>
          {orders.length === 0 ? 'No orders placed yet.' : 'No orders match the filter.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(o => {
            const sc     = STATUS_COLORS[o.status] || STATUS_COLORS.Confirmed;
            const isOpen = expanded === o.orderNo;
            return (
              <div key={o.orderNo} style={{ border: '1px solid var(--admin-border)', borderRadius: 4, overflow: 'hidden', background: 'var(--admin-surface)' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 18px', flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => setExpanded(isOpen ? null : o.orderNo)}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: '#B08D57', minWidth: 110 }}>{o.orderNo}</div>
                  <div style={{ fontSize: 13, color: 'var(--admin-muted)', minWidth: 90 }}>{new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</div>
                  <div style={{ fontSize: 14, color: 'var(--admin-text)', flex: 1, minWidth: 140 }}>{o.address.firstName} {o.address.lastName} · {o.address.mobile}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: 'var(--admin-text)', minWidth: 110 }}>{inr(o.total)}</div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 2, background: sc.bg, color: sc.color, fontSize: 12.5 }}>{o.status}</span>
                    <span style={{ fontSize: 14, color: 'var(--admin-muted)' }}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </div>

                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--admin-border)', padding: '18px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
                    <div>
                      <div style={{ fontSize: 11.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--admin-muted)', marginBottom: 10 }}>Items</div>
                      {o.lines.map((l, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: 'var(--admin-text)', padding: '6px 0', borderBottom: '1px solid var(--admin-border)' }}>
                          <span>{l.name} <span style={{ color: 'var(--admin-muted)', fontSize: 12 }}>×{l.qty} · {l.karat}</span></span>
                          <span>{inr(l.unitPrice * l.qty)}</span>
                        </div>
                      ))}
                      <div style={{ fontSize: 13.5, color: 'var(--admin-text)', padding: '8px 0', display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
                        <span>Total</span><span>{inr(o.total)}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div>
                        <div style={{ fontSize: 11.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--admin-muted)', marginBottom: 8 }}>Ship to</div>
                        <div style={{ fontSize: 13.5, color: 'var(--admin-text)', lineHeight: 1.8 }}>
                          {o.address.firstName} {o.address.lastName}<br />
                          {o.address.line1}{o.address.line2 ? `, ${o.address.line2}` : ''}<br />
                          {o.address.city}, {o.address.state} – {o.address.pincode}
                        </div>
                        <div style={{ marginTop: 6, fontSize: 12.5, color: 'var(--admin-muted)' }}>{o.deliveryMethod} · {o.payment}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--admin-muted)', marginBottom: 8 }}>Update status</div>
                        <select
                          value={o.status}
                          onChange={e => updateOrderStatus(o.orderNo, e.target.value as OrderStatus)}
                          style={{ width: '100%', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text)', padding: '10px 14px', fontSize: 13.5, borderRadius: 3, cursor: 'pointer' }}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
