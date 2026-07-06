'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { catalog, priceOf, inr } from '@/lib/catalog';

export default function AdminProductsPage() {
  const goldRate = useStore(s => s.goldRate);
  const stock    = useStore(s => s.stock);
  const [search,    setSearch]    = useState('');
  const [catFilter, setCatFilter] = useState('All');

  const cats = ['All', ...Array.from(new Set(catalog.map(p => p.cat)))];

  const filtered = catalog.filter(p => {
    const matchCat    = catFilter === 'All' || p.cat === catFilter;
    const q           = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.col.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(26px,3vw,38px)' }}>Products</h1>
        <div style={{ fontSize: 13, color: 'var(--admin-muted)' }}>{catalog.length} products · gold {inr(goldRate)}/g</div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          placeholder="Search products…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, border: '1px solid var(--admin-border)', background: 'var(--admin-surface)', color: 'var(--admin-text)', padding: '10px 14px', fontSize: 13.5, borderRadius: 3 }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)} style={{ cursor: 'pointer', padding: '8px 14px', fontSize: 12, letterSpacing: '0.06em', background: catFilter === c ? '#B08D57' : 'var(--admin-surface)', color: catFilter === c ? '#fff' : 'var(--admin-muted)', border: '1px solid var(--admin-border)', borderRadius: 3 }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
              {['ID', 'Product', 'Category', 'Metal / Karat', 'Price (live)', 'Stock', 'Tag', ''].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--admin-muted)', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const pr      = priceOf(p, p.karat, goldRate);
              const qty     = stock[p.id] ?? 5;
              const stockBg = qty === 0 ? 'rgba(180,85,59,0.12)' : qty <= 2 ? 'rgba(176,141,87,0.12)' : 'rgba(47,122,91,0.1)';
              const stockC  = qty === 0 ? '#B4553B' : qty <= 2 ? '#B08D57' : '#2F7A5B';
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                  <td style={{ padding: '13px 14px', color: 'var(--admin-muted)', fontFamily: 'monospace' }}>#{p.id}</td>
                  <td style={{ padding: '13px 14px' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: 'var(--admin-text)' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--admin-muted)', marginTop: 2 }}>{p.col}{p.gem ? ` · ${p.gem}` : ''}</div>
                  </td>
                  <td style={{ padding: '13px 14px', color: 'var(--admin-muted)' }}>{p.cat}</td>
                  <td style={{ padding: '13px 14px', color: 'var(--admin-muted)' }}>{p.karat} {p.metal}</td>
                  <td style={{ padding: '13px 14px', fontFamily: "'Cormorant Garamond',serif", fontSize: 17, color: 'var(--admin-text)' }}>
                    {inr(pr.total)}
                    <div style={{ fontSize: 11.5, color: 'var(--admin-muted)', fontFamily: 'inherit' }}>{p.rating}★ ({p.reviews})</div>
                  </td>
                  <td style={{ padding: '13px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 2, background: stockBg, color: stockC, fontSize: 12.5 }}>
                      {qty === 0 ? 'Out' : qty}
                    </span>
                  </td>
                  <td style={{ padding: '13px 14px' }}>
                    {p.tag && <span style={{ padding: '3px 8px', borderRadius: 2, background: 'rgba(176,141,87,0.12)', color: '#B08D57', fontSize: 12 }}>{p.tag}</span>}
                  </td>
                  <td style={{ padding: '13px 14px' }}>
                    <Link href={`/product/${p.id}`} style={{ fontSize: 12, color: '#B08D57', textDecoration: 'none' }} target="_blank">View →</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
