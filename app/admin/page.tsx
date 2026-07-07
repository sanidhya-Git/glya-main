'use client';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { inr } from '@/lib/catalog';

export default function AdminDashboard() {
  const orders         = useStore(s => s.orders);
  const stock          = useStore(s => s.stock);
  const adminProducts  = useStore(s => s.adminProducts);
  const productsLoaded = useStore(s => s.productsLoaded);

  const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((a, o) => a + o.total, 0);
  const orderCount = orders.filter(o => o.status !== 'Cancelled').length;
  const aov = orderCount > 0 ? Math.round(revenue / orderCount) : 0;

  const catTotals: Record<string, number> = {};
  for (const o of orders) {
    if (o.status === 'Cancelled') continue;
    for (const l of o.lines) {
      const p = adminProducts.find(x => x.id === l.productId);
      const cat = p?.cat || 'Others';
      catTotals[cat] = (catTotals[cat] || 0) + l.unitPrice * l.qty;
    }
  }
  const totalCatRevenue = Object.values(catTotals).reduce((a, b) => a + b, 0) || 1;
  const catShare = Object.entries(catTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([name, val]) => ({ name, val, pct: Math.round(val / totalCatRevenue * 100) }));

  const recent = orders.slice(0, 5);

  const LOW_THRESH = 2;
  const lowStock = adminProducts
    .map(p => ({ p, qty: stock[p.id] ?? p.stock ?? 5 }))
    .filter(x => x.qty <= LOW_THRESH)
    .sort((a, b) => a.qty - b.qty)
    .slice(0, 6);

  const CAT_COLORS: Record<string, string> = {
    Rings: '#B08D57', Necklaces: '#93733E', Bangles: '#C9A865',
    Earrings: '#DDB87A', Bracelets: '#EECB8F', Others: '#999',
  };

  const kpis = [
    { label: 'Revenue (all time)', value: inr(revenue),           icon: '₹' },
    { label: 'Orders',             value: orderCount.toLocaleString('en-IN'), icon: '◻' },
    { label: 'Avg order value',    value: inr(aov),               icon: '↗' },
    { label: 'Pending orders',     value: orders.filter(o => o.status === 'Confirmed' || o.status === 'Processing').length.toString(), icon: '⏳' },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(26px,3vw,38px)', marginBottom: 28 }}>Dashboard</h1>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 32 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 4, padding: '22px 24px' }}>
            <div style={{ fontSize: 11.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--admin-muted)', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: 'var(--admin-text)' }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20, marginBottom: 24 }}>
        {/* Category share */}
        <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 4, padding: '22px 24px' }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: 'var(--admin-text)', marginBottom: 18 }}>Revenue by category</div>
          {!productsLoaded ? (
            <p style={{ color: 'var(--admin-muted)', fontSize: 14 }}>Loading products…</p>
          ) : catShare.length === 0 ? (
            <p style={{ color: 'var(--admin-muted)', fontSize: 14 }}>No sales yet.</p>
          ) : catShare.map(c => (
            <div key={c.name} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 5, color: 'var(--admin-text)' }}>
                <span>{c.name}</span>
                <span style={{ color: 'var(--admin-muted)' }}>{inr(c.val)} · {c.pct}%</span>
              </div>
              <div style={{ height: 4, background: 'var(--admin-border)', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${c.pct}%`, background: CAT_COLORS[c.name] || '#B08D57', borderRadius: 2 }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Low stock */}
        <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 4, padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: 'var(--admin-text)' }}>Low stock</div>
            <Link href="/admin/inventory" style={{ fontSize: 12, color: '#B08D57', textDecoration: 'none' }}>Manage →</Link>
          </div>
          {!productsLoaded ? (
            <p style={{ color: 'var(--admin-muted)', fontSize: 14 }}>Loading products…</p>
          ) : adminProducts.length === 0 ? (
            <p style={{ color: 'var(--admin-muted)', fontSize: 14 }}>No products found.</p>
          ) : lowStock.length === 0 ? (
            <p style={{ color: 'var(--admin-muted)', fontSize: 14 }}>All products well-stocked.</p>
          ) : lowStock.map(x => (
            <div key={x.p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--admin-border)' }}>
              <div>
                <div style={{ fontSize: 14, color: 'var(--admin-text)' }}>{x.p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--admin-muted)' }}>{x.p.karat} {x.p.metal}</div>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: 2, background: x.qty === 0 ? 'rgba(180,85,59,0.15)' : 'rgba(176,141,87,0.12)', color: x.qty === 0 ? '#B4553B' : '#B08D57', fontSize: 12.5 }}>
                {x.qty === 0 ? 'Out of stock' : `${x.qty} left`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid var(--admin-border)' }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: 'var(--admin-text)' }}>Recent orders</div>
          <Link href="/admin/orders" style={{ fontSize: 12, color: '#B08D57', textDecoration: 'none' }}>View all →</Link>
        </div>
        {recent.length === 0 ? (
          <div style={{ padding: '32px 24px', color: 'var(--admin-muted)', fontSize: 14 }}>No orders yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
                  {['Order', 'Date', 'Customer', 'Total', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--admin-muted)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(o => (
                  <tr key={o.orderNo} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                    <td style={{ padding: '14px 20px', color: '#B08D57', fontFamily: "'Cormorant Garamond',serif", fontSize: 16 }}>{o.orderNo}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--admin-muted)' }}>{new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--admin-text)' }}>{o.address.firstName} {o.address.lastName}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--admin-text)' }}>{inr(o.total)}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 2, background: o.status === 'Delivered' ? 'rgba(47,122,91,0.12)' : o.status === 'Cancelled' ? 'rgba(180,85,59,0.12)' : 'rgba(176,141,87,0.12)', color: o.status === 'Delivered' ? '#2F7A5B' : o.status === 'Cancelled' ? '#B4553B' : '#B08D57', fontSize: 12 }}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
