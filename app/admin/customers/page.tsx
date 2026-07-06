'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { inr } from '@/lib/catalog';

function getTier(ltv: number) {
  if (ltv >= 500000) return { label: 'Platinum',    color: '#9B7FBA' };
  if (ltv >= 150000) return { label: 'Gold Circle', color: '#B08D57' };
  return                     { label: 'Silver',     color: '#8B8272' };
}

export default function AdminCustomersPage() {
  const orders = useStore(s => s.orders);
  const [search, setSearch] = useState('');

  const customerMap: Record<string, {
    mobile: string; firstName: string; lastName: string;
    orders: number; ltv: number; lastDate: string;
  }> = {};

  for (const o of orders) {
    const m = o.address.mobile;
    if (!customerMap[m]) {
      customerMap[m] = { mobile: m, firstName: o.address.firstName, lastName: o.address.lastName, orders: 0, ltv: 0, lastDate: o.date };
    }
    customerMap[m].orders += 1;
    if (o.status !== 'Cancelled') customerMap[m].ltv += o.total;
    if (o.date > customerMap[m].lastDate) {
      customerMap[m].lastDate   = o.date;
      customerMap[m].firstName  = o.address.firstName;
      customerMap[m].lastName   = o.address.lastName;
    }
  }

  const customers = Object.values(customerMap).sort((a, b) => b.ltv - a.ltv);

  const filtered = search
    ? customers.filter(c => `${c.firstName} ${c.lastName} ${c.mobile}`.toLowerCase().includes(search.toLowerCase()))
    : customers;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(26px,3vw,38px)' }}>Customers</h1>
        <div style={{ fontSize: 13, color: 'var(--admin-muted)' }}>{customers.length} unique</div>
      </div>

      <input
        placeholder="Search by name or mobile…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', maxWidth: 420, border: '1px solid var(--admin-border)', background: 'var(--admin-surface)', color: 'var(--admin-text)', padding: '10px 14px', fontSize: 13.5, borderRadius: 3, marginBottom: 20, boxSizing: 'border-box' }}
      />

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--admin-muted)', fontSize: 15 }}>
          {customers.length === 0 ? 'No customers yet. Customers are created when orders are placed.' : 'No customers match the search.'}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
                {['Customer', 'Mobile', 'Orders', 'LTV', 'Tier', 'Last order'].map(h => (
                  <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--admin-muted)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const tier = getTier(c.ltv);
                return (
                  <tr key={c.mobile} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                    <td style={{ padding: '14px 18px', color: 'var(--admin-text)', fontFamily: "'Cormorant Garamond',serif", fontSize: 17 }}>
                      {c.firstName} {c.lastName}
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--admin-muted)' }}>{c.mobile}</td>
                    <td style={{ padding: '14px 18px', color: 'var(--admin-text)' }}>{c.orders}</td>
                    <td style={{ padding: '14px 18px', fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: 'var(--admin-text)' }}>{inr(c.ltv)}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 2, background: `${tier.color}18`, color: tier.color, fontSize: 12 }}>{tier.label}</span>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--admin-muted)', fontSize: 13 }}>
                      {new Date(c.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
